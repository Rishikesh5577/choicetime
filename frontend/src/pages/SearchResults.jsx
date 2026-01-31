import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import { searchAPI } from '../utils/api';
import { useToast } from '../components/ToastContainer';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { error: showError } = useToast();
  
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: null,
    brands: [],
    sizes: [],
    sortBy: null,
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    if (query) {
      fetchSearchResults();
    }
  }, [query]);

  useEffect(() => {
    applyFilters();
  }, [products, filters]);

  const fetchSearchResults = async () => {
    setIsLoading(true);
    try {
      const response = await searchAPI.searchProducts(query);
      if (response.success) {
        setProducts(response.data.products || []);
      } else {
        showError('Failed to search products');
        setProducts([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      showError('Error searching products');
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

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
          case 'price-low-high': return priceA - priceB;
          case 'price-high-low': return priceB - priceA;
          case 'newest': return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
          default: return 0;
        }
      });
    }

    setFilteredProducts(filtered);
    setPage(1);
  };

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Search Results {query && `for "${query}"`}
          </h1>
          <p className="text-gray-600">
            {isLoading ? 'Searching...' : `Found ${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/5] bg-gray-200 rounded-lg mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
            <Link to="/" className="inline-block px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="flex gap-8">
            {/* Filters Sidebar */}
            <div className="hidden lg:block w-64 flex-shrink-0">
              <FilterSidebar
                products={products}
                filters={filters}
                onFilterChange={setFilters}
                onClearFilters={() => setFilters({ priceRange: null, brands: [], sizes: [], sortBy: null })}
              />
            </div>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Mobile Filter Toggle */}
              <div className="lg:hidden mb-4">
                <button
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg flex items-center justify-between"
                >
                  <span>Filters</span>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                </button>
              </div>

              {/* Mobile Filters */}
              {showMobileFilters && (
                <div className="lg:hidden mb-6">
                  <FilterSidebar
                    products={products}
                    filters={filters}
                    onFilterChange={setFilters}
                    onClearFilters={() => setFilters({ priceRange: null, brands: [], sizes: [], sortBy: null })}
                  />
                </div>
              )}

              {/* Products */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product._id || product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 border rounded-lg disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setPage(i + 1)}
                      className={`px-4 py-2 border rounded-lg ${
                        page === i + 1 ? 'bg-gray-900 text-white' : ''
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 border rounded-lg disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;

