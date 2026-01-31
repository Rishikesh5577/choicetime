import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import { productAPI } from '../utils/api';

const typeConfig = {
  'new-arrival': {
    title: 'New Arrivals',
    description: 'Fresh drops across men, women, watches, lenses, and accessories.',
    highlightClass: 'text-blue-600',
    ctaColor: 'text-blue-600 hover:text-blue-800',
    query: { isNewArrival: true, sort: 'createdAt', order: 'desc' },
    emptyMessage: 'No new arrivals right now. Check back soon!',
  },
  sale: {
    title: 'Mega Sale',
    description: 'Handpicked deals with the highest discounts across every category.',
    highlightClass: 'text-red-600',
    ctaColor: 'text-red-600 hover:text-red-700',
    query: { onSale: true, sort: 'discountPercent', order: 'desc' },
    emptyMessage: 'No active sale items at the moment.',
  },
};

const SpecialCollection = ({ type }) => {
  const config = useMemo(() => typeConfig[type] || typeConfig['new-arrival'], [type]);
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    priceRange: null,
    brands: [],
    sizes: [],
    sortBy: null,
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    const queryParams = {
      limit: 1000, // Fetch all products to ensure nothing is missed
      ...(config.query || {}),
    };

    const fetchSpecialProducts = async () => {
      setIsLoading(true);
      try {
        const response = await productAPI.getAllProducts(queryParams);
        if (response.success) {
          const normalized = (response.data.products || []).map((product) => ({
            ...product,
            id: product._id || product.id,
          }));
          setAllProducts(normalized);
          setProducts(normalized);
        } else {
          setAllProducts([]);
          setProducts([]);
        }
      } catch (error) {
        console.error('Error fetching special products:', error);
        setAllProducts([]);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSpecialProducts();
  }, [config, type]);

  const brands = useMemo(() => {
    const brandSet = new Set();
    allProducts.forEach((product) => {
      if (product.brand) {
        brandSet.add(product.brand);
      }
    });
    return Array.from(brandSet).sort();
  }, [allProducts]);

  const sizes = useMemo(() => {
    const sizeSet = new Set();
    allProducts.forEach((product) => {
      if (Array.isArray(product.sizes)) {
        product.sizes.forEach((size) => sizeSet.add(size));
      }
    });
    return Array.from(sizeSet).sort();
  }, [allProducts]);

  useEffect(() => {
    let filtered = [...allProducts];

    if (filters.priceRange) {
      filtered = filtered.filter((product) => {
        const price = product.finalPrice || product.price;
        const { min, max } = filters.priceRange;
        return price >= min && (max === Infinity || price <= max);
      });
    }

    if (filters.brands.length > 0) {
      filtered = filtered.filter((product) => filters.brands.includes(product.brand));
    }

    if (filters.sizes.length > 0) {
      filtered = filtered.filter((product) => {
        if (!product.sizes || !Array.isArray(product.sizes)) return false;
        return filters.sizes.some((size) => product.sizes.includes(size));
      });
    }

    if (filters.sortBy && filters.sortBy !== 'default') {
      filtered.sort((a, b) => {
        const priceA = a.finalPrice || a.price;
        const priceB = b.finalPrice || b.price;

        switch (filters.sortBy) {
          case 'price-low-high':
            return priceA - priceB;
          case 'price-high-low':
            return priceB - priceA;
          case 'newest':
            return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
          default:
            return 0;
        }
      });
    }

    setProducts(filtered);
  }, [allProducts, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      priceRange: null,
      brands: [],
      sizes: [],
      sortBy: null,
    });
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
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {config.title}
            </h1>
            <p className="text-gray-600 text-base">
              {config.description}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600 text-sm">
            Showing <span className="font-semibold text-gray-900">{products.length}</span> of{' '}
            <span className="font-semibold text-gray-900">{allProducts.length}</span> items
          </p>
          <button
            onClick={() => setShowMobileFilters(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M4 8h16M5 12h14M6 16h12M7 20h10" />
            </svg>
            Filters
          </button>
        </div>

        <div className="flex gap-6 relative">
          <div
            className={`${
              showMobileFilters ? 'block' : 'hidden'
            } lg:block w-full lg:w-64 flex-shrink-0 ${
              showMobileFilters
                ? 'fixed inset-0 z-50 bg-white p-4 overflow-y-auto lg:relative lg:z-auto lg:bg-transparent lg:p-0'
                : ''
            }`}
          >
            {showMobileFilters && (
              <div className="lg:hidden flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Filters</h2>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            <FilterSidebar
              filters={filters}
              onFilterChange={(newFilters) => {
                handleFilterChange(newFilters);
                if (window.innerWidth >= 1024) {
                  setShowMobileFilters(false);
                }
              }}
              onClearFilters={() => {
                handleClearFilters();
                if (window.innerWidth >= 1024) {
                  setShowMobileFilters(false);
                }
              }}
              onCloseMobile={() => setShowMobileFilters(false)}
              brands={brands}
              sizes={sizes}
            />
          </div>

          <div className="flex-1 w-full lg:w-auto">
            {isLoading ? (
              <div className="min-h-[40vh] flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                  <p className="text-gray-600">Collecting the best picks for you...</p>
                </div>
              </div>
            ) : products.length === 0 ? (
              <div className="min-h-[30vh] flex flex-col items-center justify-center text-center">
                <p className="text-gray-600 text-lg mb-4">{config.emptyMessage}</p>
                <Link to="/" className={`${config.ctaColor} font-medium`}>
                  Explore all products →
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id || product.id} product={normalizeProduct(product)} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialCollection;


