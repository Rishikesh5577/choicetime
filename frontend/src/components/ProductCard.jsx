import { useState, memo } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import LoginModal from './LoginModal';
import { handleImageError } from '../utils/imageFallback';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  
  const [isHovered, setIsHovered] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [showSizes, setShowSizes] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hoverImageLoaded, setHoverImageLoaded] = useState(false);

  // Data Normalization
  // Handle images - support both array and object formats
  let productImages = [];
  if (product.images) {
    if (Array.isArray(product.images)) {
      productImages = product.images.filter(img => img && img.trim() !== '');
    } else if (typeof product.images === 'object') {
      // Convert object format {image1: "url", image2: "url"} to array
      productImages = Object.values(product.images).filter(img => img && typeof img === 'string' && img.trim() !== '');
    }
  }
  
  // Fallback to image or thumbnail if images array is empty
  if (productImages.length === 0) {
    const fallbackImage = product.image || product.thumbnail || product.images?.image1;
    if (fallbackImage) {
      productImages = [fallbackImage];
    }
  }
  
  const isWatch = (product.category || '').toLowerCase().includes('watch');
  const isLens = (product.category || '').toLowerCase().includes('lens');
  const sizes = isWatch ? [] : (product.sizes || ['S', 'M', 'L', 'XL']); 
  const finalPrice = product.finalPrice || product.price || product.mrp || 0;
  const originalPrice = product.originalPrice || product.mrp || product.price || 0;
  const hasDiscount = originalPrice > finalPrice && finalPrice > 0;
  const productId = product._id || product.id;
  
  // Get the image source with fallback
  // For lenses, use the 2nd image (index 1) as default if available
  let defaultImageIndex = 0;
  if (isLens && productImages.length > 1) {
    defaultImageIndex = 1; // Use 2nd image (image2) for lenses
  }
  
  // Determine which images to show
  let defaultImageSrc = 'https://via.placeholder.com/400x500?text=No+Image';
  let hoverImageSrc = null;
  
  if (productImages.length > 0) {
    defaultImageSrc = productImages[defaultImageIndex];
    // Get hover image (next image if available)
    const hoverIndex = defaultImageIndex + 1;
    if (productImages.length > hoverIndex) {
      hoverImageSrc = productImages[hoverIndex];
    } else if (productImages.length > 0 && defaultImageIndex > 0) {
      // If no next image, try the first image as hover
      hoverImageSrc = productImages[0];
    }
  }

  const handleAddClick = (e) => {
    e.preventDefault();
    e.stopPropagation(); 
    if (sizes.length > 0) {
      setShowSizes(true);
    } else {
      handleAddToCart(null);
    }
  };

  const handleAddToCart = async (selectedSize) => {
    if (!isAuthenticated) return setShowLoginModal(true);
    
    setIsAdding(true);
    try {
      await addToCart({ ...product, selectedSize });
      setTimeout(() => {
        setIsAdding(false);
        setShowSizes(false);
      }, 1000);
    } catch (err) {
      setIsAdding(false);
      if (err.message.includes('login')) setShowLoginModal(true);
    }
  };


  return (
    <>
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      
      <div 
        // OPTIMIZATION: translate-z-0 forces hardware acceleration
        className="group relative w-full select-none transform-gpu translate-z-0" 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          if (window.matchMedia('(min-width: 768px)').matches) {
            setShowSizes(false);
          }
        }}
      >
        <Link to={`/product/${productId}`} className="block">
          
          {/* IMAGE AREA */}
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-gray-100 shadow-sm">
            

            {/* Discount Tag */}
            {hasDiscount && (
               <span className="absolute top-3 left-3 z-20 bg-black text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide">
                 Sale
               </span>
            )}

            {/* Base Image - Always visible */}
            {defaultImageSrc && (
              <img
                src={defaultImageSrc}
                alt={product.name || product.title || 'Product'}
                onLoad={() => setImageLoaded(true)}
                decoding="async"
                loading="lazy"
                className={`
                  absolute inset-0 w-full h-full object-cover transition-all duration-500
                  ${imageLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'}
                `}
                onError={handleImageError}
              />
            )}

            {/* Hover Image - Appears as cover on hover */}
            {hoverImageSrc && (
              <>
                {/* Preload hover image */}
                <img
                  src={hoverImageSrc}
                  alt=""
                  className="hidden"
                  onLoad={() => setHoverImageLoaded(true)}
                  decoding="async"
                />
                {/* Hover cover image */}
                <img
                  src={hoverImageSrc}
                  alt={product.name || product.title || 'Product'}
                  className={`
                    absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out
                    ${isHovered && hoverImageLoaded ? 'opacity-100 z-10' : 'opacity-0 z-0'}
                  `}
                  onError={handleImageError}
                />
              </>
            )}

            {/* --- THE FLOATING DOCK --- */}
            <div className="absolute bottom-3 inset-x-2 sm:inset-x-4 z-20">
              <div 
                className={`
                  bg-white/95 backdrop-blur-md rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.1)] 
                  overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]
                  ${showSizes ? 'py-3' : 'h-10 sm:h-12 flex items-center justify-between pl-3 pr-1'}
                `}
                onClick={(e) => e.preventDefault()}
              >
                {!showSizes ? (
                  <>
                    <div className="flex flex-col leading-none justify-center">
                      <span className="font-bold text-gray-900 text-sm sm:text-base">
                        {finalPrice > 0 ? `₹${finalPrice.toLocaleString()}` : 'Price N/A'}
                      </span>
                      {hasDiscount && originalPrice > 0 && (
                        <span className="text-[10px] text-gray-500 line-through">₹{originalPrice.toLocaleString()}</span>
                      )}
                    </div>
                    
                    <button
                      onClick={handleAddClick}
                      className="h-8 sm:h-10 px-3 sm:px-5 bg-black text-white rounded-md text-[10px] sm:text-xs font-bold uppercase tracking-wide transition-transform active:scale-95 flex items-center gap-1.5"
                    >
                      <span className='hidden lg:block'>Add</span>
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </button>
                  </>
                ) : (
                  <div className="relative px-2 text-center w-full animate-fadeIn">
                    <div className="flex items-center justify-between mb-2 px-1">
                      <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Select Size</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowSizes(false);
                        }}
                        className="p-1 -mr-1 text-gray-400 hover:text-gray-900"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <div className="grid grid-cols-4 gap-1.5">
                      {sizes.slice(0, 4).map((size) => (
                        <button
                          key={size}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleAddToCart(size);
                          }}
                          disabled={isAdding}
                          className={`
                            h-8 rounded text-xs font-bold border transition-colors touch-manipulation
                            ${isAdding 
                              ? 'bg-gray-100 text-gray-300 border-gray-100'
                              : 'border-gray-200 hover:border-black hover:bg-black hover:text-white text-gray-800 active:bg-black active:text-white'}
                          `}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* TEXT INFO */}
          <div className="mt-3 px-1">
             <div className="flex justify-between items-start">
               <div className="flex-1 pr-2">
                  <h3 className="text-sm font-medium text-gray-900 leading-tight line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">{product.category}</p>
               </div>
               
               {product.rating && product.rating > 0 && (
                 <div className="hidden sm:flex items-center gap-1 bg-gray-50 px-1.5 py-0.5 rounded text-[10px] font-bold text-gray-600">
                   <span>★</span>
                   <span>{product.rating}</span>
                 </div>
               )}
             </div>
          </div>
        </Link>
      </div>
    </>
  );
};

// PERFORMANCE FIX: 
// Only re-render if the product ID changes. 
// This prevents the "stutter" when infinite scroll adds new items.
export default memo(ProductCard, (prev, next) => {
  return (prev.product._id || prev.product.id) === (next.product._id || next.product.id);
});