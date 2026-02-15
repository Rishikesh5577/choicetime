import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import LoginModal from '../components/LoginModal';
import ProductCard from '../components/ProductCard';
import { handleImageError } from '../utils/imageFallback';
import { productAPI, reviewAPI, shippingReturnAPI } from '../utils/api';

const ProductDetail = () => {
  const { id, category } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedBoxType, setSelectedBoxType] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [recommendedProducts, setRecommendedProducts] = useState([]); // For "You may also like"
  const [trendingProducts, setTrendingProducts] = useState([]); // For "Trending Now"
  const [saleProducts, setSaleProducts] = useState([]); // For "Sale" section
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [loadingTrending, setLoadingTrending] = useState(false);
  const [loadingSale, setLoadingSale] = useState(false);

  // Refs for scrollable containers
  const recommendedScrollRef = useRef(null);
  const saleScrollRef = useRef(null);
  const brandScrollRef = useRef(null);
  const trendingScrollRef = useRef(null);

  // Scroll state for each section
  const [scrollStates, setScrollStates] = useState({
    recommended: { canScrollLeft: false, canScrollRight: false },
    sale: { canScrollLeft: false, canScrollRight: false },
    brand: { canScrollLeft: false, canScrollRight: false },
    trending: { canScrollLeft: false, canScrollRight: false },
  });

  // Review states
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState(null);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [reviewSort, setReviewSort] = useState('newest');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    title: '',
    comment: '',
  });
  const [shareCopied, setShareCopied] = useState(false);
  const [cartSuccessPopup, setCartSuccessPopup] = useState(false);

  const [shippingPolicies, setShippingPolicies] = useState([]);
  const [loadingShippingPolicies, setLoadingShippingPolicies] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id, category]);

  useEffect(() => {
    if (product) {
      fetchReviews(product);
    }
  }, [reviewSort, product]);

  useEffect(() => {
    const load = async () => {
      setLoadingShippingPolicies(true);
      try {
        const res = await shippingReturnAPI.getPolicies();
        if (res?.success && Array.isArray(res.data?.policies)) {
          setShippingPolicies(res.data.policies);
        }
      } catch (e) {
        console.error('Shipping policies load failed:', e);
      } finally {
        setLoadingShippingPolicies(false);
      }
    };
    load();
  }, []);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const validCategories = ['men', 'women', 'watches', 'lens', 'accessories'];
      const categoryMap = {
        'watches': 'watches', 'watch': 'watches',
        'lens': 'lens', 'lenses': 'lens',
        'accessories': 'accessories',
        'men': 'men', 'mens': 'men',
        'women': 'women', 'womens': 'women',
        'fashion': 'men',
      };

      let foundData = null;

      // Try to fetch with the provided category first
      if (category && category !== 'undefined') {
        const apiCategory = categoryMap[category] || category;
        try {
          // Use the appropriate API method based on category
          switch (apiCategory) {
            case 'watches':
              foundData = await productAPI.getWatchById(id);
              break;
            case 'lens':
              foundData = await productAPI.getLensById(id);
              break;
            case 'accessories':
              foundData = await productAPI.getAccessoryById(id);
              break;
            case 'men':
              foundData = await productAPI.getMenItemById(id);
              break;
            case 'women':
              foundData = await productAPI.getWomenItemById(id);
              break;
            default:
              // Try as generic fetch if category doesn't match
              break;
          }
        } catch (err) {
          console.warn("Direct category fetch failed, trying fallback...", err);
        }
      }

      // If not found, try all categories
      if (!foundData || !foundData.success) {
        for (const cat of validCategories) {
          try {
            switch (cat) {
              case 'watches':
                foundData = await productAPI.getWatchById(id);
                break;
              case 'lens':
                foundData = await productAPI.getLensById(id);
                break;
              case 'accessories':
                foundData = await productAPI.getAccessoryById(id);
                break;
              case 'men':
                foundData = await productAPI.getMenItemById(id);
                break;
              case 'women':
                foundData = await productAPI.getWomenItemById(id);
                break;
            }
            if (foundData && foundData.success) {
              break;
            }
          } catch (e) {
            // continue to next category
            continue;
          }
        }
      }

      if (foundData && foundData.success) {
        setProduct(foundData.data.product);
        if (foundData.data.product.sizes?.length > 0) setSelectedSize(foundData.data.product.sizes[0]);
        if (foundData.data.product.colorOptions?.length > 0) setSelectedColor(foundData.data.product.colorOptions[0]);
        else if (foundData.data.product.colors?.length > 0) setSelectedColor(foundData.data.product.colors[0]);
        if (foundData.data.product.boxOptions?.length > 0) {
          const firstBox = foundData.data.product.boxOptions[0];
          setSelectedBoxType(typeof firstBox === 'string' ? firstBox : firstBox.name);
        }
        // Fetch recommended products after product is loaded
        fetchRecommendedProducts(foundData.data.product);
        fetchTrendingProducts(foundData.data.product);
        fetchSaleProducts(foundData.data.product);
        fetchReviews(foundData.data.product);
      } else {
        throw new Error('Product not found in any category');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch related products (same category/subcategory/brand) for "You may also like"
  const fetchRecommendedProducts = async (currentProduct) => {
    if (!currentProduct) return;

    setLoadingRecommendations(true);
    try {
      const currentProductId = currentProduct._id || currentProduct.id;
      const categoryMap = {
        'watches': 'watches',
        'lens': 'lens',
        'lenses': 'lens',
        'accessories': 'accessories',
        'men': 'men',
        'women': 'women',
      };

      const productCategory = currentProduct.category?.toLowerCase() || category?.toLowerCase();
      const apiCategory = categoryMap[productCategory] || productCategory;

      let relatedProducts = [];

      // Fetch products from the SAME category/subcategory for related recommendations
      if (apiCategory === 'men') {
        const response = await productAPI.getMenItems({
          limit: 30,
          subCategory: currentProduct.subCategory
        });
        if (response.success) relatedProducts = response.data.products || [];
      } else if (apiCategory === 'women') {
        const response = await productAPI.getWomenItems({
          limit: 30,
          subCategory: currentProduct.subCategory
        });
        if (response.success) relatedProducts = response.data.products || [];
      } else if (apiCategory === 'watches') {
        const response = await productAPI.getWatches({ limit: 30 });
        if (response.success) relatedProducts = response.data.products || [];
      } else if (apiCategory === 'lens') {
        const response = await productAPI.getLenses({ limit: 30 });
        if (response.success) relatedProducts = response.data.products || [];
      } else if (apiCategory === 'accessories') {
        const response = await productAPI.getAccessories({ limit: 30 });
        if (response.success) relatedProducts = response.data.products || [];
      }

      // Filter out current product and prioritize by brand if available
      let filtered = relatedProducts.filter(p => (p._id || p.id) !== currentProductId);

      // If product has a brand, prioritize same brand products
      if (currentProduct.brand) {
        const sameBrand = filtered.filter(p => p.brand === currentProduct.brand);
        const differentBrand = filtered.filter(p => p.brand !== currentProduct.brand);
        filtered = [...sameBrand, ...differentBrand];
      }

      // Shuffle array to randomize
      const shuffleArray = (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
      };

      const shuffled = shuffleArray(filtered);
      const selectedProducts = shuffled.slice(0, 10);

      // Normalize products
      const normalized = selectedProducts.map(p => ({
        ...p,
        id: p._id || p.id,
        images: p.images || [p.image || p.thumbnail],
        image: p.images?.[0] || p.image || p.thumbnail,
        price: p.price || p.finalPrice,
        originalPrice: p.originalPrice || p.mrp || p.price,
      }));

      setRecommendedProducts(normalized);
    } catch (error) {
      console.error('Error fetching recommended products:', error);
      setRecommendedProducts([]);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  // Fetch completely random products from ALL categories for "Trending Now"
  const fetchTrendingProducts = async (currentProduct) => {
    if (!currentProduct) return;

    setLoadingTrending(true);
    try {
      const currentProductId = currentProduct._id || currentProduct.id;
      const productsByCategory = {
        men: [],
        women: [],
        watches: [],
        lenses: [],
        accessories: []
      };

      // Fetch products from ALL categories
      const fetchPromises = [
        productAPI.getMenItems({ limit: 40 }).then(res => {
          if (res.success && res.data?.products) {
            productsByCategory.men = res.data.products;
          }
        }).catch(err => console.warn('Error fetching men items:', err)),

        productAPI.getWomenItems({ limit: 40 }).then(res => {
          if (res.success && res.data?.products) {
            productsByCategory.women = res.data.products;
          }
        }).catch(err => console.warn('Error fetching women items:', err)),

        productAPI.getWatches({ limit: 30 }).then(res => {
          if (res.success && res.data?.products) {
            productsByCategory.watches = res.data.products;
          }
        }).catch(err => console.warn('Error fetching watches:', err)),

        productAPI.getLenses({ limit: 30 }).then(res => {
          if (res.success && res.data?.products) {
            productsByCategory.lenses = res.data.products;
          }
        }).catch(err => console.warn('Error fetching lenses:', err)),

        productAPI.getAccessories({ limit: 30 }).then(res => {
          if (res.success && res.data?.products) {
            productsByCategory.accessories = res.data.products;
          }
        }).catch(err => console.warn('Error fetching accessories:', err)),
      ];

      await Promise.allSettled(fetchPromises);

      // Combine all products from all categories
      const allProducts = [
        ...productsByCategory.men,
        ...productsByCategory.women,
        ...productsByCategory.watches,
        ...productsByCategory.lenses,
        ...productsByCategory.accessories
      ].filter(p => (p._id || p.id) !== currentProductId);

      // Shuffle array to randomize (Fisher-Yates shuffle)
      const shuffleArray = (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
      };

      // Get completely random mix from all categories
      const shuffled = shuffleArray(allProducts);
      const randomProducts = shuffled.slice(0, 12);

      // Normalize products
      const normalized = randomProducts.map(p => ({
        ...p,
        id: p._id || p.id,
        images: p.images || [p.image || p.thumbnail],
        image: p.images?.[0] || p.image || p.thumbnail,
        price: p.price || p.finalPrice,
        originalPrice: p.originalPrice || p.mrp || p.price,
      }));

      setTrendingProducts(normalized);
    } catch (error) {
      console.error('Error fetching trending products:', error);
      setTrendingProducts([]);
    } finally {
      setLoadingTrending(false);
    }
  };

  // Fetch reviews for the product
  const fetchReviews = async (currentProduct) => {
    if (!currentProduct) return;

    setLoadingReviews(true);
    try {
      const productId = String(currentProduct._id || currentProduct.id);
      const response = await reviewAPI.getReviews(productId, reviewSort, 50);

      if (response.success) {
        setReviews(response.data.reviews || []);
        setReviewStats(response.data.statistics || null);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
      setReviewStats(null);
    } finally {
      setLoadingReviews(false);
    }
  };

  // Handle review sort change
  const handleReviewSortChange = (newSort) => {
    setReviewSort(newSort);
    if (product) {
      const productId = String(product._id || product.id);
      reviewAPI.getReviews(productId, newSort, 50)
        .then(response => {
          if (response.success) {
            setReviews(response.data.reviews || []);
          }
        })
        .catch(error => console.error('Error fetching sorted reviews:', error));
    }
  };

  // Handle review form submission
  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    if (!reviewForm.rating || !reviewForm.title.trim() || !reviewForm.comment.trim()) {
      alert('Please fill in all fields and select a rating');
      return;
    }

    setSubmittingReview(true);
    try {
      const productId = String(product._id || product.id);
      const productCategory = product.category || category || 'general';

      const response = await reviewAPI.createReview({
        productId,
        productCategory,
        rating: reviewForm.rating,
        title: reviewForm.title.trim(),
        comment: reviewForm.comment.trim(),
      });

      if (response.success) {
        // Reset form
        setReviewForm({ rating: 0, title: '', comment: '' });
        setShowReviewForm(false);
        // Refresh reviews
        await fetchReviews(product);
        alert('Review submitted successfully!');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert(error.message || 'Failed to submit review. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  };

  // Mark review as helpful
  const handleMarkHelpful = async (reviewId) => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    try {
      const response = await reviewAPI.markHelpful(reviewId);
      if (response.success) {
        // Update the review in the list
        setReviews(prevReviews =>
          prevReviews.map(review =>
            review._id === reviewId
              ? { ...review, helpful: response.data.helpful, isHelpful: response.data.isHelpful }
              : review
          )
        );
      }
    } catch (error) {
      console.error('Error marking review as helpful:', error);
    }
  };

  // Fetch products on sale for "Sale" section
  const fetchSaleProducts = async (currentProduct) => {
    if (!currentProduct) return;

    setLoadingSale(true);
    try {
      const currentProductId = currentProduct._id || currentProduct.id;
      const productsByCategory = {
        men: [],
        women: [],
        watches: [],
        lenses: [],
        accessories: []
      };

      // Fetch products from ALL categories
      const fetchPromises = [
        productAPI.getMenItems({ limit: 50 }).then(res => {
          if (res.success && res.data?.products) {
            productsByCategory.men = res.data.products;
          }
        }).catch(err => console.warn('Error fetching men items:', err)),

        productAPI.getWomenItems({ limit: 50 }).then(res => {
          if (res.success && res.data?.products) {
            productsByCategory.women = res.data.products;
          }
        }).catch(err => console.warn('Error fetching women items:', err)),

        productAPI.getWatches({ limit: 40 }).then(res => {
          if (res.success && res.data?.products) {
            productsByCategory.watches = res.data.products;
          }
        }).catch(err => console.warn('Error fetching watches:', err)),

        productAPI.getLenses({ limit: 40 }).then(res => {
          if (res.success && res.data?.products) {
            productsByCategory.lenses = res.data.products;
          }
        }).catch(err => console.warn('Error fetching lenses:', err)),

        productAPI.getAccessories({ limit: 40 }).then(res => {
          if (res.success && res.data?.products) {
            productsByCategory.accessories = res.data.products;
          }
        }).catch(err => console.warn('Error fetching accessories:', err)),
      ];

      await Promise.allSettled(fetchPromises);

      // Combine all products and filter for sale items
      const allProducts = [
        ...productsByCategory.men,
        ...productsByCategory.women,
        ...productsByCategory.watches,
        ...productsByCategory.lenses,
        ...productsByCategory.accessories
      ];

      // Filter products that are on sale (have discount or onSale flag)
      const saleItems = allProducts.filter(p => {
        const productId = p._id || p.id;
        if (productId === currentProductId) return false;

        const finalPrice = p.price || p.finalPrice;
        const originalPrice = p.originalPrice || p.mrp || 0;
        const hasDiscount = originalPrice > 0 && originalPrice > finalPrice;
        const discountPercent = p.discountPercent || (hasDiscount ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100) : 0);

        return p.onSale === true || hasDiscount || discountPercent > 0;
      });

      // Shuffle array to randomize
      const shuffleArray = (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
      };

      const shuffled = shuffleArray(saleItems);
      const selectedSaleProducts = shuffled.slice(0, 12);

      // Normalize products
      const normalized = selectedSaleProducts.map(p => ({
        ...p,
        id: p._id || p.id,
        images: p.images || [p.image || p.thumbnail],
        image: p.images?.[0] || p.image || p.thumbnail,
        price: p.price || p.finalPrice,
        originalPrice: p.originalPrice || p.mrp || p.price,
      }));

      setSaleProducts(normalized);
    } catch (error) {
      console.error('Error fetching sale products:', error);
      setSaleProducts([]);
    } finally {
      setLoadingSale(false);
    }
  };

  const productId = product?._id || product?.id;
  const wishlisted = productId ? isInWishlist(productId) : false;

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) return setShowLoginModal(true);
    try {
      await toggleWishlist(productId);
    } catch (error) {
      console.error('Wishlist error:', error);
    }
  };

  const handleShareProduct = async () => {
    const shareData = {
      title: product.name,
      text: `Check out ${product.name}${product.brand ? ` by ${product.brand}` : ''} - ₹${product.salePrice || product.price}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);
      }
    } catch (error) {
      // User cancelled share or error - try clipboard fallback
      if (error.name !== 'AbortError') {
        try {
          await navigator.clipboard.writeText(window.location.href);
          setShareCopied(true);
          setTimeout(() => setShareCopied(false), 2000);
        } catch {
          console.error('Share failed:', error);
        }
      }
    }
  };

  // Get the price of the currently selected box option
  const getSelectedBoxPrice = () => {
    if (!selectedBoxType || !product?.boxOptions?.length) return 0;
    const found = product.boxOptions.find((opt) =>
      typeof opt === 'string' ? opt === selectedBoxType : opt.name === selectedBoxType
    );
    if (!found || typeof found === 'string') return 0;
    return Number(found.price) || 0;
  };

  const selectedBoxPrice = getSelectedBoxPrice();

  const handleAddToCart = async () => {
    if (!isAuthenticated) return setShowLoginModal(true);
    try {
      await addToCart(product, 1, selectedSize, selectedColor, selectedBoxType, selectedBoxPrice);
      setCartSuccessPopup(true);
      setTimeout(() => setCartSuccessPopup(false), 2500);
    } catch (error) {
      if (error.message.includes('login')) setShowLoginModal(true);
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) return setShowLoginModal(true);
    try {
      await addToCart(product, 1, selectedSize, selectedColor, selectedBoxType, selectedBoxPrice);
      navigate('/checkout');
    } catch (error) {
      if (error.message.includes('login')) setShowLoginModal(true);
    }
  };

  const handlePrevImage = () => {
    const productImages = product.images || [product.image || product.thumbnail];
    setSelectedImageIndex((prev) => (prev === 0 ? productImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    const productImages = product.images || [product.image || product.thumbnail];
    setSelectedImageIndex((prev) => (prev === productImages.length - 1 ? 0 : prev + 1));
  };

  // Scroll functions for product sections
  const scrollSection = (ref, direction) => {
    if (!ref.current) return;
    const container = ref.current;
    const firstCard = container.querySelector('.flex-shrink-0');
    if (!firstCard) return;

    // Get actual card width including gap
    const cardWidth = firstCard.offsetWidth;
    const gap = 16; // gap-4 = 16px
    const scrollAmount = cardWidth + gap;

    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  // Check scroll position and update button states
  const checkScrollPosition = (ref, sectionKey) => {
    if (!ref.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = ref.current;
    setScrollStates(prev => ({
      ...prev,
      [sectionKey]: {
        canScrollLeft: scrollLeft > 0,
        canScrollRight: scrollLeft < scrollWidth - clientWidth - 1
      }
    }));
  };

  // useEffect to check scroll positions
  useEffect(() => {
    const handleScroll = () => {
      checkScrollPosition(recommendedScrollRef, 'recommended');
      checkScrollPosition(saleScrollRef, 'sale');
      checkScrollPosition(brandScrollRef, 'brand');
      checkScrollPosition(trendingScrollRef, 'trending');
    };

    // Check initial state
    handleScroll();

    // Add scroll listeners
    const refs = [recommendedScrollRef, saleScrollRef, brandScrollRef, trendingScrollRef];
    refs.forEach(ref => {
      if (ref.current) {
        ref.current.addEventListener('scroll', handleScroll);
      }
    });

    // Check on resize
    window.addEventListener('resize', handleScroll);

    return () => {
      refs.forEach(ref => {
        if (ref.current) {
          ref.current.removeEventListener('scroll', handleScroll);
        }
      });
      window.removeEventListener('resize', handleScroll);
    };
  }, [recommendedProducts, saleProducts, trendingProducts, product?.brand]);

  if (loading) return <LoadingState />;
  if (!product) return <NotFoundState />;

  const productImages = product.images || [product.image || product.thumbnail];
  const finalPrice = product.price || product.finalPrice;
  const originalPrice = product.originalPrice || product.mrp || 0;

  // Split product name for highlighting
  const nameWords = product.name.split(' ');
  const highlightWords = ['black', 'strap', 'steel', 'pro', 'sport'];

  return (
    <>
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />

      <div className="min-h-screen bg-[#F7F4EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            back
          </button>

          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 xl:gap-16">

            {/* LEFT COLUMN: Product Visualization */}
            <div className="relative lg:sticky lg:top-[120px] h-fit order-first lg:order-first">

              {/* Image Section: Thumbnails left (vertical) + Main Image */}
              <div className="flex gap-2 sm:gap-3 mb-3">

                {/* Vertical Thumbnails - tablet & desktop */}
                {productImages.length > 1 && (
                  <div className="hidden sm:flex flex-col gap-1.5 w-14 md:w-16 flex-shrink-0">
                    {productImages.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all ${
                          selectedImageIndex === idx
                            ? 'border-gray-900 shadow-sm'
                            : 'border-gray-200 hover:border-gray-400 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={img}
                          alt={`${product.name} ${idx + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => handleImageError(e, 100, 100)}
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Main Product Image */}
                <div className="relative flex-1 aspect-square bg-gray-100 rounded-lg sm:rounded-xl overflow-hidden shadow-md max-w-xs sm:max-w-none mx-auto">

                  {/* Top-right: Wishlist + Share */}
                  <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
                    <button
                      onClick={handleToggleWishlist}
                      className={`group w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg hover:scale-110 active:scale-95 ${
                        wishlisted
                          ? 'bg-white ring-2 ring-red-400'
                          : 'bg-white/95 backdrop-blur-md hover:bg-white'
                      }`}
                      aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                      <svg
                        className={`w-5 h-5 sm:w-[22px] sm:h-[22px] transition-all duration-200 ${wishlisted ? 'text-red-500 fill-red-500 scale-110' : 'text-gray-500 group-hover:text-red-400'}`}
                        fill={wishlisted ? 'currentColor' : 'none'}
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                    <button
                      onClick={handleShareProduct}
                      className="group relative w-10 h-10 sm:w-11 sm:h-11 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white transition-all duration-200 shadow-md hover:shadow-lg hover:scale-110 active:scale-95"
                      aria-label="Share product"
                    >
                      {shareCopied && (
                        <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs font-medium px-2.5 py-1 rounded-lg whitespace-nowrap shadow-lg">
                          Link copied!
                        </span>
                      )}
                      <svg className="w-5 h-5 sm:w-[22px] sm:h-[22px] text-gray-500 group-hover:text-gray-800 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                    </button>
                  </div>

                  {/* Navigation Arrows */}
                  {productImages.length > 1 && (
                    <div className="absolute bottom-2 right-2 z-10 flex gap-1">
                      <button
                        onClick={handlePrevImage}
                        className="w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-sm"
                        aria-label="Previous image"
                      >
                        <svg className="w-3.5 h-3.5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-sm"
                        aria-label="Next image"
                      >
                        <svg className="w-3.5 h-3.5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  )}

                  {/* Image counter */}
                  {productImages.length > 1 && (
                    <div className="absolute top-2 left-2 z-10 bg-black/50 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
                      {selectedImageIndex + 1}/{productImages.length}
                    </div>
                  )}

                  <img
                    src={productImages[selectedImageIndex]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => handleImageError(e, 600, 600)}
                  />
                </div>
              </div>

              {/* Horizontal Thumbnails - mobile only */}
              {productImages.length > 1 && (
                <div className="flex sm:hidden gap-1.5 mb-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  {productImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-11 h-11 flex-shrink-0 rounded overflow-hidden border-2 transition-all ${
                        selectedImageIndex === idx
                          ? 'border-gray-900'
                          : 'border-gray-200 opacity-50 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} ${idx + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => handleImageError(e, 80, 80)}
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-3">
                  <label className="block text-xs font-medium text-gray-900 mb-1.5">Select Size</label>
                  <div className="flex flex-wrap gap-1.5">
                    {product.sizes.map((size) => {
                      const isSelected = selectedSize === size;
                      return (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-2.5 py-1.5 rounded-md border transition-all flex items-center gap-1 text-xs ${isSelected
                            ? 'border-gray-900 bg-gray-50 font-semibold'
                            : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                          <span className="font-medium text-gray-900">{size}</span>
                          {isSelected && (
                            <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>

            {/* RIGHT COLUMN: Product Information */}
            <div className="flex flex-col space-y-3 sm:space-y-4 lg:space-y-5 order-last lg:order-last">

              {/* Product Title & Brand */}
              <div className="space-y-1.5">
                {product.brand && (
                  <div className="text-[11px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {product.brand}
                  </div>
                )}
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 leading-snug">
                  {nameWords.map((word, idx) => {
                    const shouldHighlight = highlightWords.some(hw => word.toLowerCase().includes(hw.toLowerCase()));
                    return (
                      <span key={idx} className="inline-block mr-1.5">
                        {shouldHighlight ? (
                          <span className="relative inline-block">
                            <span className="relative z-10">{word}</span>
                            <span className="absolute inset-0 bg-gray-200/40 rounded-lg blur-sm transform -rotate-1 -z-0"></span>
                          </span>
                        ) : (
                          <span>{word}</span>
                        )}
                      </span>
                    );
                  })}
                </h1>
              </div>

              {/* Price Section */}
              <div className="flex flex-wrap items-baseline gap-2 pb-3 border-b border-gray-200">
                <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">₹{(finalPrice + selectedBoxPrice).toLocaleString()}</span>
                {selectedBoxPrice > 0 && (
                  <span className="text-xs text-gray-500">(₹{finalPrice.toLocaleString()} + ₹{selectedBoxPrice} box)</span>
                )}
                {originalPrice > 0 && originalPrice > finalPrice && (
                  <>
                    <span className="text-sm sm:text-base text-gray-400 line-through">₹{originalPrice.toLocaleString()}</span>
                    <span className="text-[11px] sm:text-xs font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                      {product.discountPercent > 0 ? product.discountPercent : Math.round(((originalPrice - finalPrice) / originalPrice) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>

              {/* Color Selection */}
              {(product.colorOptions?.length > 0 || product.colors?.length > 0 || product.color) && (
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-1.5">Select Color</label>
                  <div className="flex flex-wrap gap-1.5">
                    {(product.colorOptions || product.colors || [product.color]).filter(Boolean).map((color, idx) => {
                      const isSelected = selectedColor === color || (!selectedColor && idx === 0);
                      const isHexColor = /^#([0-9A-F]{3}){1,2}$/i.test(color) || /^(rgb|hsl)/i.test(color);
                      
                      if (isHexColor) {
                        return (
                          <button
                            key={idx}
                            onClick={() => setSelectedColor(color)}
                            className={`relative w-8 h-8 rounded-full border-2 transition-all ${isSelected ? 'border-gray-900 scale-110 shadow-md' : 'border-gray-300 hover:border-gray-500'}`}
                            style={{ backgroundColor: color }}
                            aria-label={`Select color ${color}`}
                          >
                            {isSelected && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <svg className="w-4 h-4 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            )}
                          </button>
                        );
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => setSelectedColor(color)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs sm:text-sm font-medium transition-all ${
                            isSelected
                              ? 'border-gray-900 bg-gray-900 text-white shadow-sm'
                              : 'border-gray-300 bg-white text-gray-700 hover:border-gray-500'
                          }`}
                        >
                          <svg className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                          </svg>
                          {color}
                          {isSelected && (
                            <svg className="w-3.5 h-3.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Box Type Selection */}
              {product.boxOptions && product.boxOptions.length > 0 && (
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-1.5">Select Box Type</label>
                  <div className="flex flex-wrap gap-1.5">
                    {product.boxOptions.map((boxOpt) => {
                      const boxName = typeof boxOpt === 'string' ? boxOpt : boxOpt.name;
                      const boxPrice = typeof boxOpt === 'string' ? 0 : (Number(boxOpt.price) || 0);
                      const isSelected = selectedBoxType === boxName;
                      return (
                        <button
                          key={boxName}
                          onClick={() => setSelectedBoxType(boxName)}
                          className={`px-3 py-1.5 rounded-md border transition-all flex items-center gap-1.5 text-xs sm:text-sm ${isSelected
                            ? 'border-gray-900 bg-gray-900 text-white'
                            : 'border-gray-200 hover:border-gray-400 text-gray-700'
                            }`}
                        >
                          <svg className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                          <span className="font-medium">{boxName}</span>
                          <span className={`text-xs ${isSelected ? 'text-green-300' : 'text-gray-500'}`}>
                            {boxPrice > 0 ? `+₹${boxPrice}` : 'FREE'}
                          </span>
                          {isSelected && (
                            <svg className="w-3.5 h-3.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {selectedBoxPrice > 0 && (
                    <p className="text-xs text-gray-500 mt-1.5">Box price +₹{selectedBoxPrice} will be added to total</p>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-row gap-2">
                <div className="flex-1 relative">
                  {cartSuccessPopup && (
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 z-10 bg-green-600 text-white text-xs font-medium px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
                      Product added successfully
                    </span>
                  )}
                  <button
                    onClick={handleAddToCart}
                    className="w-full flex items-center justify-center gap-1.5 bg-gray-900 hover:bg-gray-800 text-white font-semibold px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all shadow-md hover:shadow-lg active:scale-[0.98] text-xs sm:text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>Add to Cart</span>
                  </button>
                </div>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-white hover:bg-gray-50 text-gray-900 font-semibold px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all shadow-sm hover:shadow-md active:scale-[0.98] text-xs sm:text-sm border border-gray-900"
                >
                  <span>Buy Now</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
                <button
                  onClick={handleShareProduct}
                  className="group relative flex items-center justify-center w-10 sm:w-11 rounded-lg border bg-white border-gray-200 hover:border-gray-800 hover:bg-gray-50 transition-all duration-200 active:scale-[0.92]"
                  aria-label="Share product"
                >
                  {shareCopied && (
                    <span className="absolute -top-9 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-medium px-2.5 py-1 rounded-lg whitespace-nowrap shadow-lg">
                      Link copied!
                    </span>
                  )}
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-800 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </button>
              </div>

              {/* Reviews Summary */}
              {reviewStats && reviewStats.averageRating > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{reviewStats.averageRating.toFixed(1)}</div>
                      <div className="flex items-center gap-0.5 mt-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`w-4 h-4 ${star <= Math.round(reviewStats.averageRating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                              }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-2">
                        Based on <span className="font-semibold text-gray-900">{reviewStats.totalReviews}</span> reviews
                      </p>
                      {reviewStats.ratingDistribution && (
                        <div className="space-y-1.5">
                          {[5, 4, 3, 2, 1].slice(0, 3).map((rating) => {
                            const count = reviewStats.ratingDistribution[rating] || 0;
                            const percentage = reviewStats.totalReviews > 0
                              ? (count / reviewStats.totalReviews) * 100
                              : 0;
                            return (
                              <div key={rating} className="flex items-center gap-2">
                                <span className="text-xs text-gray-600 w-6">{rating}★</span>
                                <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-yellow-400 transition-all duration-300"
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                                <span className="text-xs text-gray-500 w-8 text-right">{count}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                  {reviews.length > 0 && (
                    <div className="pt-4 border-t border-gray-200">
                      <div className="space-y-3">
                        {reviews.slice(0, 2).map((review) => (
                          <div key={review._id} className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-xs font-semibold text-gray-600">
                                {(review.userName || 'A')[0].toUpperCase()}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium text-gray-900">{review.userName || 'Anonymous'}</span>
                                <div className="flex items-center gap-0.5">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <svg
                                      key={star}
                                      className={`w-3 h-3 ${star <= review.rating
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-300'
                                        }`}
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                  ))}
                                </div>
                              </div>
                              <p className="text-sm font-medium text-gray-900 mb-1 line-clamp-1">{review.title}</p>
                              <p className="text-xs text-gray-600 line-clamp-2">{review.comment}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Product Details */}
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Details</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <p className="leading-relaxed">
                    {product.description || product.productDetails?.description || 'Premium quality product designed for comfort and style.'}
                  </p>
                  <div className="pt-3 border-t border-gray-100 space-y-2">
                    {product.brand && (
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-900">Brand:</span>
                        <span>{product.brand}</span>
                      </div>
                    )}
                    {product.productDetails?.fabric && (
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-900">Fabric:</span>
                        <span>{product.productDetails.fabric}</span>
                      </div>
                    )}
                    {product.color && (
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-900">Color:</span>
                        <span className="capitalize">{product.color}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Watch Specifications - Only show if any watch field exists */}
              {(() => {
                // Check for watch-specific fields (support both naming conventions)
                const specs = [
                  { label: 'Model', value: product.model || product.productDetails?.modelNumber },
                  { label: 'Functions', value: product.functions || product.productDetails?.function },
                  { label: 'Dial Color', value: product.dialColor },
                  { label: 'Dial Size', value: product.dialSize || product.caseWidth },
                  { label: 'Strap Color', value: product.strapColor || product.bandColor || product.productDetails?.strapColor },
                  { label: 'Strap Material', value: product.strapMaterial || product.bandMaterial || product.productDetails?.strapMaterial },
                  { label: 'Crystal Material', value: product.crystalMaterial || product.glassMaterial },
                  { label: 'Case Material', value: product.caseMaterial },
                  { label: 'Case Shape', value: product.caseShape },
                  { label: 'Lock Type', value: product.lockType || product.productDetails?.lockMechanism },
                  { label: 'Water Resistance', value: product.waterResistance },
                  { label: 'Display Type', value: product.displayType },
                  { label: 'Calendar Type', value: product.calendarType },
                  { label: 'Movement', value: product.movement || product.movementType || product.productDetails?.movement },
                  { label: 'Item Weight', value: product.itemWeight },
                  { label: 'Quality', value: product.quality },
                  { label: 'Warranty', value: product.warranty },
                ].filter(spec => spec.value);

                if (specs.length === 0) return null;

                return (
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-200 bg-gray-50">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Watch Specifications
                      </h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <tbody>
                          {specs.map((spec, index) => (
                            <tr key={spec.label} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                              <td className="px-5 py-3 font-medium text-gray-900 whitespace-nowrap w-40 border-r border-gray-100">
                                {spec.label}
                              </td>
                              <td className="px-5 py-3 text-gray-700">
                                {spec.value}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })()}

              {/* Delivery & Returns Info (from admin) */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping & Returns</h3>
                <div className="space-y-3 text-sm">
                  {loadingShippingPolicies ? (
                    <div className="text-gray-500">Loading...</div>
                  ) : (shippingPolicies && shippingPolicies.length > 0) ? (
                    shippingPolicies.map((policy) => {
                      const iconColorClass = policy.iconColor === 'blue' ? 'text-blue-600' : policy.iconColor === 'purple' ? 'text-purple-600' : 'text-green-600';
                      const iconPath = policy.iconColor === 'blue'
                        ? 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
                        : policy.iconColor === 'purple'
                        ? 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                        : 'M5 13l4 4L19 7';
                      return (
                        <div key={policy._id} className="flex items-start gap-3">
                          <svg className={`w-5 h-5 ${iconColorClass} mt-0.5 flex-shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPath} />
                          </svg>
                          <div>
                            <p className="font-medium text-gray-900">{policy.title}</p>
                            <p className="text-gray-600">{policy.description}</p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <>
                      <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <div>
                          <p className="font-medium text-gray-900">Free Shipping</p>
                          <p className="text-gray-600">On orders over ₹1,000. Standard delivery in 5-7 business days.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <div>
                          <p className="font-medium text-gray-900">5-Day Returns</p>
                          <p className="text-gray-600">Easy returns within 30 days of purchase. No questions asked.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <div>
                          <p className="font-medium text-gray-900">Secure Payment</p>
                          <p className="text-gray-600">Your payment information is safe and encrypted.</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Trending Now Section - All Product Recommendations */}
          <div className="mt-12 sm:mt-16 pt-8 sm:pt-12 border-t border-gray-200 mb-12 sm:mb-20">
            <div className="mb-6 sm:mb-8">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1">Trending Now</h2>
              <p className="text-xs sm:text-sm text-gray-600">Popular picks across all categories</p>
            </div>

            {/* You may also like - Related products (exclude same-brand products shown in "More from Brand" section) */}
            {(loadingRecommendations || recommendedProducts.filter(p => !product?.brand || p.brand !== product.brand).length > 0) && (
              <div className="mb-8 sm:mb-12">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">You may also like</h3>
                {loadingRecommendations ? (
                  <div className="flex gap-4 overflow-x-auto pb-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex-shrink-0 w-56 sm:w-64 animate-pulse">
                        <div className="aspect-[4/5] bg-gray-200 rounded-lg mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="relative">
                    {/* Left Arrow */}
                    {scrollStates.recommended.canScrollLeft && (
                      <button
                        onClick={() => scrollSection(recommendedScrollRef, 'left')}
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2.5 hover:bg-gray-50 transition-all"
                        aria-label="Scroll left"
                      >
                        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                    )}
                    {/* Right Arrow */}
                    {scrollStates.recommended.canScrollRight && (
                      <button
                        onClick={() => scrollSection(recommendedScrollRef, 'right')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2.5 hover:bg-gray-50 transition-all"
                        aria-label="Scroll right"
                      >
                        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    )}
                    <div
                      ref={recommendedScrollRef}
                      className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide"
                      style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none'
                      }}
                    >
                      <div className="flex gap-4 min-w-max">
                        {recommendedProducts
                          .filter(p => !product?.brand || p.brand !== product.brand)
                          .map((recommendedProduct) => (
                          <div key={recommendedProduct.id} className="flex-shrink-0 w-56 sm:w-64">
                            <ProductCard product={recommendedProduct} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* On Sale Section (exclude products already in recommended) */}
            {(loadingSale || saleProducts.filter(p => !recommendedProducts.some(r => r.id === p.id)).length > 0) && (
              <div className="mb-8 sm:mb-12">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">On Sale</h3>
                {loadingSale ? (
                  <div className="flex gap-4 overflow-x-auto pb-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex-shrink-0 w-56 sm:w-64 animate-pulse">
                        <div className="aspect-[4/5] bg-gray-200 rounded-lg mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="relative">
                    {/* Left Arrow */}
                    {scrollStates.sale.canScrollLeft && (
                      <button
                        onClick={() => scrollSection(saleScrollRef, 'left')}
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2.5 hover:bg-gray-50 transition-all"
                        aria-label="Scroll left"
                      >
                        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                    )}
                    {/* Right Arrow */}
                    {scrollStates.sale.canScrollRight && (
                      <button
                        onClick={() => scrollSection(saleScrollRef, 'right')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2.5 hover:bg-gray-50 transition-all"
                        aria-label="Scroll right"
                      >
                        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    )}
                    <div
                      ref={saleScrollRef}
                      className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide"
                      style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none'
                      }}
                    >
                      <div className="flex gap-4 min-w-max">
                        {saleProducts
                          .filter(p => !recommendedProducts.some(r => r.id === p.id))
                          .map((saleProduct) => (
                          <div key={saleProduct.id} className="flex-shrink-0 w-56 sm:w-64">
                            <ProductCard product={saleProduct} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* More from [Brand] Section */}
            {product?.brand && (loadingRecommendations || recommendedProducts.filter(p => p.brand === product.brand).length > 0) && (
              <div className="mb-8 sm:mb-12">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">More from {product.brand}</h3>
                {loadingRecommendations ? (
                  <div className="flex gap-4 overflow-x-auto pb-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex-shrink-0 w-56 sm:w-64 animate-pulse">
                        <div className="aspect-[4/5] bg-gray-200 rounded-lg mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="relative">
                    {/* Left Arrow */}
                    {scrollStates.brand.canScrollLeft && (
                      <button
                        onClick={() => scrollSection(brandScrollRef, 'left')}
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2.5 hover:bg-gray-50 transition-all"
                        aria-label="Scroll left"
                      >
                        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                    )}
                    {/* Right Arrow */}
                    {scrollStates.brand.canScrollRight && (
                      <button
                        onClick={() => scrollSection(brandScrollRef, 'right')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2.5 hover:bg-gray-50 transition-all"
                        aria-label="Scroll right"
                      >
                        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    )}
                    <div
                      ref={brandScrollRef}
                      className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide"
                      style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none'
                      }}
                    >
                      <div className="flex gap-4 min-w-max">
                        {recommendedProducts
                          .filter(p => p.brand === product.brand)
                          .slice(0, 8)
                          .map((recommendedProduct) => (
                            <div key={recommendedProduct.id} className="flex-shrink-0 w-56 sm:w-64">
                              <ProductCard product={recommendedProduct} />
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Trending Now - Random Mix from ALL Categories (exclude products already in recommended/sale) */}
            {(loadingTrending || trendingProducts.filter(p => !recommendedProducts.some(r => r.id === p.id) && !saleProducts.some(s => s.id === p.id)).length > 0) && (
              <div>
                {loadingTrending ? (
                  <div className="flex gap-4 overflow-x-auto pb-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex-shrink-0 w-56 sm:w-64 animate-pulse">
                        <div className="aspect-[4/5] bg-gray-200 rounded-lg mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="relative">
                    {/* Left Arrow */}
                    {scrollStates.trending.canScrollLeft && (
                      <button
                        onClick={() => scrollSection(trendingScrollRef, 'left')}
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2.5 hover:bg-gray-50 transition-all"
                        aria-label="Scroll left"
                      >
                        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                    )}
                    {/* Right Arrow */}
                    {scrollStates.trending.canScrollRight && (
                      <button
                        onClick={() => scrollSection(trendingScrollRef, 'right')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2.5 hover:bg-gray-50 transition-all"
                        aria-label="Scroll right"
                      >
                        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    )}
                    <div
                      ref={trendingScrollRef}
                      className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide"
                      style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none'
                      }}
                    >
                      <div className="flex gap-4 min-w-max">
                        {trendingProducts
                          .filter(p => !recommendedProducts.some(r => r.id === p.id) && !saleProducts.some(s => s.id === p.id))
                          .map((trendingProduct) => (
                          <div key={trendingProduct.id} className="flex-shrink-0 w-56 sm:w-64">
                            <ProductCard product={trendingProduct} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Reviews Section */}
          <div className="mt-12 sm:mt-16 pt-8 sm:pt-12 border-t border-gray-200 mb-12 sm:mb-20">
            {/* Header with Title and Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 border-b border-gray-200 pb-4 sm:pb-5 mb-6">
              <div className="flex items-center gap-4 flex-wrap">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  Customer Reviews {reviews.length > 0 && `(${reviews.length})`}
                </h3>
                {isAuthenticated && !showReviewForm && (
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-all shadow-md hover:shadow-lg active:scale-95"
                  >
                    Write a Review
                  </button>
                )}
                {!isAuthenticated && (
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-all shadow-md hover:shadow-lg active:scale-95"
                  >
                    Login to Write a Review
                  </button>
                )}
              </div>
              {reviews.length > 0 && (
                <select
                  value={reviewSort}
                  onChange={(e) => handleReviewSortChange(e.target.value)}
                  className="w-full sm:w-auto text-sm border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="highest">Highest Rating</option>
                  <option value="lowest">Lowest Rating</option>
                  <option value="helpful">Most Helpful</option>
                </select>
              )}
            </div>

            {/* Review Form */}
            {showReviewForm && (
              <div className="border border-gray-200 rounded-lg p-4 sm:p-6 lg:p-8 bg-gray-50 mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Write a Review</h3>
                <form onSubmit={handleReviewSubmit} className="space-y-4 sm:space-y-5">
                  {/* Star Rating */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating *
                    </label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                          className={`w-8 h-8 ${star <= reviewForm.rating
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                            } hover:text-yellow-400 transition-colors`}
                        >
                          <svg fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Review Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Review Title *
                    </label>
                    <input
                      type="text"
                      value={reviewForm.title}
                      onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                      placeholder="Give your review a title"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                      maxLength={200}
                      required
                    />
                  </div>

                  {/* Review Comment */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Review *
                    </label>
                    <textarea
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      placeholder="Share your experience with this product"
                      rows={5}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm resize-none"
                      maxLength={2000}
                      required
                    />
                    <div className="text-xs text-gray-500 mt-1 text-right">
                      {reviewForm.comment.length}/2000
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-gray-900 text-white text-sm sm:text-base font-semibold rounded-lg hover:bg-gray-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                    >
                      {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowReviewForm(false);
                        setReviewForm({ rating: 0, title: '', comment: '' });
                      }}
                      className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-white text-gray-700 text-sm sm:text-base font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 transition-all active:scale-95"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Reviews List */}
            {loadingReviews ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-20 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : reviews.length > 0 ? (
              <div className="space-y-6 sm:space-y-8">
                {reviews.map((review) => (
                  <div key={review._id} className="border-b border-gray-200 pb-6 sm:pb-8 last:border-0">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 mb-3">
                      <div className="flex-1 w-full">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <div className="font-semibold text-sm sm:text-base text-gray-900">
                            {review.userName || 'Anonymous'}
                          </div>
                          {review.verifiedPurchase && (
                            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded font-medium">
                              Verified Purchase
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg
                                key={star}
                                className={`w-4 h-4 sm:w-5 sm:h-5 ${star <= review.rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                                  }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-xs sm:text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <h4 className="font-semibold text-sm sm:text-base text-gray-900 mb-2 sm:mb-3">
                      {review.title}
                    </h4>

                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4 sm:mb-5 whitespace-pre-wrap">
                      {review.comment}
                    </p>

                    {/* Helpful Button */}
                    <button
                      onClick={() => handleMarkHelpful(review._id)}
                      className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600 hover:text-gray-900 transition-colors py-1"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                      </svg>
                      <span className="font-medium">Helpful ({review.helpful || 0})</span>
                    </button>
                  </div>
                ))}
              </div>
            ) : !loadingReviews ? (
              <div className="text-center py-8 sm:py-12">
                <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6">No reviews yet. Be the first to review this product!</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

const LoadingState = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
      <p className="text-gray-500 font-medium">Loading details...</p>
    </div>
  </div>
);

const NotFoundState = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
    <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
    <p className="text-gray-500 mb-6">The product you are looking for doesn't exist or has been removed.</p>
    <Link to="/" className="bg-gray-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
      Back to Home
    </Link>
  </div>
);

export default ProductDetail;
