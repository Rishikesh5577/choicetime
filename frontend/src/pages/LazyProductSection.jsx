// components/LazyProductSection.jsx
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const LazyProductSection = ({ title, link, fetchFunction, bgColor = "bg-white", viewAllLink }) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const sectionRef = useRef(null);
  const ITEMS_PER_PAGE = 8; // Number of items per page

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // If section is visible and hasn't loaded yet, fetch data
        if (entry.isIntersecting && !hasLoaded) {
          fetchData(1);
        }
      },
      { rootMargin: '200px' } // Start loading 200px before user reaches section
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, [hasLoaded]);

  const fetchData = async (page = 1) => {
    setIsLoading(true);
    try {
      const data = await fetchFunction({
        page,
        limit: ITEMS_PER_PAGE,
        ...(currentPage !== 1 && { skip: (page - 1) * ITEMS_PER_PAGE })
      });
      
      if (data.success) {
        setProducts(data.data.products);
        setTotalProducts(data.data.total || data.data.products.length);
        setTotalPages(Math.ceil((data.data.total || data.data.products.length) / ITEMS_PER_PAGE));
        setCurrentPage(page);
        setHasLoaded(true);
      }
    } catch (error) {
      console.error(`Error loading section ${title}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const normalizeProduct = (product) => ({
    ...product,
    id: product._id || product.id,
    images: product.images || [product.image || product.thumbnail],
    image: product.images?.[0] || product.image || product.thumbnail,
    price: product.finalPrice || product.price,
    originalPrice: product.originalPrice || product.mrp || product.price,
    rating: product.rating || 0,
    reviews: product.reviewsCount || product.reviews || 0,
    category: product.category,
  });

  return (
    <section ref={sectionRef} className={`py-16 ${bgColor} min-h-[400px]`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <h2 className={`text-2xl md:text-3xl font-bold uppercase tracking-tight ${bgColor.includes('rose') ? 'text-rose-600' : 'text-gray-900'}`}>
            {title}
          </h2>
          {viewAllLink && (
            <Link to={viewAllLink} className="text-sm font-bold uppercase tracking-wider border-b-2 border-transparent hover:border-gray-900 transition-all">
              View All
            </Link>
          )}
        </div>

        {/* LOADING STATE (Skeleton) */}
        {isLoading && !hasLoaded && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 aspect-[4/5] rounded-xl mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        )}

        {/* DATA STATE */}
        {hasLoaded && products.length > 0 && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
              {products.map((product) => (
                <ProductCard key={product._id || product.id} product={normalizeProduct(product)} />
              ))}
            </div>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 space-x-2">
                <button
                  onClick={() => fetchData(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border rounded-md disabled:opacity-50"
                >
                  Previous
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Show first page, last page, and pages around current page
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => fetchData(pageNum)}
                      className={`px-4 py-2 border rounded-md ${
                        currentPage === pageNum ? 'bg-black text-white' : 'hover:bg-gray-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => fetchData(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border rounded-md disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* EMPTY STATE */}
        {hasLoaded && products.length === 0 && (
           <div className="text-center py-10 text-gray-500">No products found.</div>
        )}
      </div>
    </section>
  );
};

export default LazyProductSection;