import { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import { productAPI } from '../utils/api';

const CategoryPage = () => {
  const { gender, category } = useParams();
  const location = useLocation();
  const pathname = location.pathname;
  
  // State for Data
  const [allProducts, setAllProducts] = useState([]); // Raw Data from API
  const [filteredList, setFilteredList] = useState([]); // Data after Filters apply
  const [products, setProducts] = useState([]); // Data currently Visible (Rendered)
  
  const [isLoading, setIsLoading] = useState(false);
  const [pageTitle, setPageTitle] = useState('');
  
  // State for Pagination & Filters
  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState({
    priceRange: null,
    brands: [],
    sizes: [],
    sortBy: null,
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showFilters, setShowFilters] = useState(true); // Desktop filter visibility

  const pathSegments = pathname.split('/').filter(Boolean);
  const genderFromPath = pathSegments[0] === 'men' ? 'men' : pathSegments[0] === 'women' ? 'women' : null;
  const derivedGender = (gender ? gender.toLowerCase() : null) || genderFromPath;
  const derivedCategory = category || pathSegments[1] || null;

  // 1. Initial Data Fetch
  useEffect(() => {
    fetchProducts();
    // Reset filters when category changes
    setFilters({
      priceRange: null,
      brands: [],
      sizes: [],
      sortBy: null,
    });
  }, [pathname, gender, category, location.search]);

  // 2. Filter Logic (Updates filteredList)
  useEffect(() => {
    let filtered = [...allProducts];

    // Subcategory Filtering
    if (derivedGender && derivedCategory) {
      const categoryMap = {
        'shirt': { subCategory: 'shirt', displayName: 'Shirt' },
        'tshirt': { subCategory: 'tshirt', displayName: 'T-Shirt' },
        't-shirt': { subCategory: 'tshirt', displayName: 'T-Shirt' },
        'jeans': { subCategory: 'jeans', displayName: 'Jeans' },
        'trousers': { subCategory: 'trousers', displayName: 'Trousers' },
        'shoes': { subCategory: 'shoes', displayName: 'Shoes' },
        'shoe': { subCategory: 'shoes', displayName: 'Shoes' },
        'saree': { subCategory: 'saree', displayName: 'Saree' },
        'sari': { subCategory: 'saree', displayName: 'Saree' },
        'accessories': { subCategory: 'accessories', displayName: 'Accessories' },
      };
      const categoryInfo = categoryMap[derivedCategory.toLowerCase()];
      
      if (categoryInfo) {
        filtered = filtered.filter(product => {
          const productSubCategory = (product.subCategory || '').toLowerCase().trim().replace(/-/g, '');
          const expectedSubCategory = categoryInfo.subCategory.toLowerCase().trim().replace(/-/g, '');
          return productSubCategory === expectedSubCategory;
        });
      }
    }

    // Price Filter
    if (filters.priceRange) {
      filtered = filtered.filter(product => {
        const price = product.finalPrice || product.price;
        const { min, max } = filters.priceRange;
        return price >= min && (max === Infinity || price <= max);
      });
    }

    // Brand Filter
    if (filters.brands && filters.brands.length > 0) {
      filtered = filtered.filter(product => 
        filters.brands.includes(product.brand)
      );
    }

    // Size Filter
    if (filters.sizes && filters.sizes.length > 0) {
      filtered = filtered.filter(product => {
        if (!product.sizes || !Array.isArray(product.sizes)) return false;
        return filters.sizes.some(size => product.sizes.includes(size));
      });
    }

    // Sort - Default to price low to high if no sort is selected
    filtered.sort((a, b) => {
      const priceA = a.finalPrice || a.price || 0;
      const priceB = b.finalPrice || b.price || 0;

      // If no sort is selected or sortBy is 'default', sort by price low to high
      if (!filters.sortBy || filters.sortBy === 'default') {
        return priceA - priceB;
      }

      // Apply selected sort
      switch (filters.sortBy) {
        case 'price-low-high': return priceA - priceB;
        case 'price-high-low': return priceB - priceA;
        case 'newest': return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        default: return priceA - priceB; // Default to low to high
      }
    });

    setFilteredList(filtered);
    setPage(1); // Reset to page 1 when filters change
  }, [allProducts, filters, derivedGender, derivedCategory]);

  // Reset to page 1 when filter visibility changes (items per page changes)
  useEffect(() => {
    setPage(1);
  }, [showFilters]);

  // Calculate items per page based on filter visibility
  const itemsPerPage = showFilters ? 21 : 28;

  // 3. Pagination Logic (Updates visible products)
  useEffect(() => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setProducts(filteredList.slice(startIndex, endIndex));
    
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [filteredList, page, itemsPerPage]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredList.length / itemsPerPage);

  // Pagination handlers
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      // Show all pages if total pages is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (page <= 3) {
        // Show first 5 pages
        for (let i = 2; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (page >= totalPages - 2) {
        // Show last 5 pages
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show pages around current page
        pages.push('...');
        for (let i = page - 1; i <= page + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      let response = null;

      // Get gender and subCategory from query params if available
      const urlParams = new URLSearchParams(location.search);
      const genderParam = urlParams.get('gender');
      const subCategoryParam = urlParams.get('subCategory');

      const activeGender =
        (gender ? gender.toLowerCase() : null) ||
        (genderParam ? genderParam.toLowerCase() : null) ||
        genderFromPath;

      const normalizedCategory = category || pathSegments[1] || null;

      // Determine which API to call based on route
      // Use a high limit to fetch all products (1000 should be enough for most cases)
      const fetchLimit = 1000;
      
      if (pathname === '/watches') {
        const params = { ...(genderParam ? { gender: genderParam } : {}), limit: fetchLimit };
        if (urlParams.get('subCategory')) params.subCategory = urlParams.get('subCategory');
        response = await productAPI.getWatches(params);
        const subLabel = urlParams.get('subCategory') ? ` ${urlParams.get('subCategory').charAt(0).toUpperCase() + urlParams.get('subCategory').slice(1)}` : '';
        setPageTitle(genderParam ? `${genderParam.charAt(0).toUpperCase() + genderParam.slice(1)}'s${subLabel} Watches` : (subLabel ? subLabel.trim() + ' Watches' : 'Watches'));
      } else if (pathname === '/lenses') {
        const params = { ...(genderParam ? { gender: genderParam } : {}), limit: fetchLimit };
        response = await productAPI.getLenses(params);
        setPageTitle(genderParam ? `${genderParam.charAt(0).toUpperCase() + genderParam.slice(1)}'s Lenses` : 'Lenses & Spectacles');
      } else if (pathname === '/accessories') {
        const params = { ...(genderParam ? { gender: genderParam } : {}), limit: fetchLimit };
        if (subCategoryParam) params.subCategory = subCategoryParam;
        response = await productAPI.getAccessories(params);
        const genderLabel = genderParam ? `${genderParam.charAt(0).toUpperCase() + genderParam.slice(1)}'s ` : '';
        const subLabel = subCategoryParam ? subCategoryParam.charAt(0).toUpperCase() + subCategoryParam.slice(1) : 'Accessories';
        setPageTitle(genderParam && subCategoryParam ? `${genderLabel}${subLabel}` : (genderParam ? `${genderLabel}Accessories` : 'Accessories'));
      } else if (pathname === '/men') {
        response = await productAPI.getMenItems({ limit: fetchLimit });
        setPageTitle("Men's Collection");
      } else if (pathname === '/women') {
        response = await productAPI.getWomenItems({ limit: fetchLimit });
        setPageTitle("Women's Collection");
      } else if (activeGender && normalizedCategory) {
      const categoryMap = {
        'shirt': { subCategory: 'shirt', displayName: 'Shirt' },
        'tshirt': { subCategory: 'tshirt', displayName: 'T-Shirt' },
        't-shirt': { subCategory: 'tshirt', displayName: 'T-Shirt' },
        'jeans': { subCategory: 'jeans', displayName: 'Jeans' },
        'trousers': { subCategory: 'trousers', displayName: 'Trousers' },
        'shoes': { subCategory: 'shoes', displayName: 'Shoes' },
        'shoe': { subCategory: 'shoes', displayName: 'Shoes' },
        'saree': { subCategory: 'saree', displayName: 'Saree' },
        'sari': { subCategory: 'saree', displayName: 'Saree' },
        'accessories': { subCategory: 'accessories', displayName: 'Accessories' },
      };

        const categoryInfo = categoryMap[normalizedCategory.toLowerCase()];
        
        if (categoryInfo) {
          const fetcher = activeGender === 'women' ? productAPI.getWomenItems : productAPI.getMenItems;
          response = await fetcher({ subCategory: categoryInfo.subCategory, limit: fetchLimit });
          
          if (response && response.success && response.data.products) {
            const filteredProducts = response.data.products.filter(product => {
              const productSubCategory = (product.subCategory || '').toLowerCase().trim().replace(/-/g, '');
              const expectedSubCategory = categoryInfo.subCategory.toLowerCase().trim().replace(/-/g, '');
              return productSubCategory === expectedSubCategory;
            });
            response.data.products = filteredProducts;
          }
          
          const genderDisplay = activeGender.charAt(0).toUpperCase() + activeGender.slice(1);
          setPageTitle(`${genderDisplay}'s ${categoryInfo.displayName}`);
        } else {
          setPageTitle('Category Not Found');
          setAllProducts([]);
          setIsLoading(false);
          return;
        }
      } else {
        response = await productAPI.getAllProducts({ limit: fetchLimit });
        setPageTitle('All Products');
      }

      if (response && response.success) {
        setAllProducts(response.data.products || []);
      } else {
        setAllProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setAllProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const normalizeProduct = (product) => {
    return {
      ...product,
      id: product._id || product.id,
      images: product.images || [product.image || product.thumbnail],
      image: product.images?.[0] || product.image || product.thumbnail,
      price: product.finalPrice || product.price,
      originalPrice: product.originalPrice || product.mrp || product.price,
      rating: product.rating || 0,
      reviews: product.reviewsCount || product.reviews || 0,
      category: product.category,
    };
  };

  const brands = useMemo(() => {
    const brandSet = new Set();
    allProducts.forEach(product => {
      if (product.brand) brandSet.add(product.brand);
    });
    return Array.from(brandSet).sort();
  }, [allProducts]);

  const sizes = useMemo(() => {
    const sizeSet = new Set();
    allProducts.forEach(product => {
      if (product.sizes && Array.isArray(product.sizes)) {
        product.sizes.forEach(size => sizeSet.add(size));
      }
    });
    return Array.from(sizeSet).sort();
  }, [allProducts]);

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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Row - Breadcrumb, Title, and Product Count */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Breadcrumb Navigation */}
        {(derivedGender || pathname === '/men' || pathname === '/women') && (
              <nav>
                <ol className="flex items-center space-x-2 text-sm text-gray-500">
              <li>
                    <Link to="/" className="hover:text-gray-900 transition-colors">
                      Home
                    </Link>
              </li>
              <li className="text-gray-400">/</li>
              {derivedGender && (
                <>
                  <li>
                        <Link to={`/${derivedGender}`} className="hover:text-gray-900 transition-colors capitalize">
                      {derivedGender}
                    </Link>
                  </li>
                  {category && (
                    <>
                      <li className="text-gray-400">/</li>
                          <li className="text-gray-900 capitalize">
                        {category === 'tshirt' ? 'T-Shirt' : category}
                      </li>
                    </>
                  )}
                </>
              )}
              {!derivedGender && (pathname === '/men' || pathname === '/women') && (
                    <li className="text-gray-900 capitalize">
                  {pathname.replace('/', '')}
                </li>
              )}
            </ol>
          </nav>
        )}

            {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900">
            {isLoading && !pageTitle ? 'Loading...' : pageTitle}
          </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Product Count */}
            {!isLoading && filteredList.length > 0 && (
              <p className="text-sm text-gray-500 whitespace-nowrap">
                Showing {((page - 1) * itemsPerPage) + 1} - {Math.min(page * itemsPerPage, filteredList.length)} of {filteredList.length} products
              </p>
            )}
            
            {/* Filter Toggle Button */}
          <button
            onClick={() => {
              if (window.innerWidth >= 1024) {
                setShowFilters(!showFilters);
              } else {
                setShowMobileFilters(!showMobileFilters);
              }
            }}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap"
            disabled={isLoading}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span className="hidden lg:inline">{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
            <span className="lg:hidden">Filters</span>
          </button>
          </div>
        </div>
        
        <div className="flex gap-6 relative">
          {/* Filter Sidebar */}
          <div className={`
            ${showMobileFilters ? 'block' : 'hidden'} 
            lg:block
            w-full 
            lg:w-1/4 
            lg:flex-shrink-0
            lg:transition-transform lg:duration-500 lg:ease-[cubic-bezier(0.25,0.1,0.25,1)]
            ${showFilters 
              ? 'lg:translate-x-0 lg:pointer-events-auto' 
              : 'lg:-translate-x-full lg:pointer-events-none lg:absolute lg:left-0 lg:overflow-hidden'
            }
            ${showMobileFilters ? 'fixed inset-0 z-50 bg-white p-4 overflow-y-auto lg:relative lg:z-auto lg:bg-transparent lg:p-0 lg:-ml-8' : 'lg:-ml-8'}
          `}>
             {showMobileFilters && (
               <div className="lg:hidden flex items-center justify-between mb-4">
                 <h2 className="text-xl font-bold">Filters</h2>
                 <button onClick={() => setShowMobileFilters(false)} className="text-gray-600 hover:text-gray-800">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                   </svg>
                 </button>
               </div>
             )}
             
             {/* Mobile Chips */}
             {derivedGender && (
               <div className="lg:hidden mb-4 space-y-2">
                 <p className="text-xs uppercase tracking-wide text-gray-500">Subcategories</p>
                 <div className="flex flex-wrap gap-2">
                   {['shirt', 'tshirt', 'trousers', 'saree', 'shoes', 'accessories'].map((sub) => (
                     <Link
                       key={sub}
                       to={`/${derivedGender}/${sub}`}
                       className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                         derivedCategory === sub ? 'bg-gray-900 text-white' : 'text-gray-600'
                       }`}
                       onClick={() => setShowMobileFilters(false)}
                     >
                       {sub === 'tshirt' ? 'T-Shirt' : sub.charAt(0).toUpperCase() + sub.slice(1)}
                     </Link>
                   ))}
                 </div>
               </div>
             )}

             {/* Sidebar Component */}
             <FilterSidebar
               filters={filters}
               onFilterChange={(newFilters) => {
                 handleFilterChange(newFilters);
                 if (window.innerWidth >= 1024) setShowMobileFilters(false);
               }}
               onClearFilters={() => {
                 handleClearFilters();
                 if (window.innerWidth >= 1024) setShowMobileFilters(false);
               }}
               onCloseMobile={() => setShowMobileFilters(false)}
               brands={brands}
               sizes={sizes}
             />
          </div>

          {/* Products Grid Area */}
          <div className={`
            flex-1 w-full lg:w-auto 
            lg:transition-all lg:duration-500 lg:ease-[cubic-bezier(0.25,0.1,0.25,1)]
            ${showFilters ? 'lg:translate-y-0' : 'lg:-translate-y-2'}
          `}>
            {isLoading ? null : (
              products.length > 0 ? (
                <>
                  <div className={`grid grid-cols-2 gap-4 sm:gap-6 ${showFilters ? 'lg:grid-cols-3 xl:grid-cols-4' : 'lg:grid-cols-4'}`}>
                    {products.map((product) => (
                      <ProductCard key={product._id || product.id} product={normalizeProduct(product)} />
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="mt-8 flex flex-col items-center gap-4">
                      <div className="flex items-center gap-2 flex-wrap justify-center">
                        {/* Previous Button */}
                        <button
                          onClick={() => handlePageChange(page - 1)}
                          disabled={page === 1}
                          className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 transition-all"
                        >
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Previous
                          </span>
                        </button>

                        {/* Page Numbers */}
                        {getPageNumbers().map((pageNum, index) => {
                          if (pageNum === '...') {
                            return (
                              <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
                                ...
                              </span>
                            );
                          }
                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`min-w-[40px] px-3 py-2 text-sm font-semibold rounded-lg border-2 transition-all ${
                                page === pageNum
                                  ? 'bg-gray-900 text-white border-gray-900 shadow-lg'
                                  : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}

                        {/* Next Button */}
                        <button
                          onClick={() => handlePageChange(page + 1)}
                          disabled={page === totalPages}
                          className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 transition-all"
                        >
                          <span className="flex items-center gap-1">
                            Next
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </span>
                        </button>
                      </div>

                      {/* Page Info */}
                      <p className="text-sm text-gray-500">
                        Page {page} of {totalPages}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg mb-4">No products found matching your filters.</p>
                  {filters.priceRange || filters.brands?.length > 0 || filters.sizes?.length > 0 ? (
                    <button
                      onClick={handleClearFilters}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Clear filters to see all products
                    </button>
                  ) : (derivedGender || pathname === '/men' || pathname === '/women') ? (
                    <Link
                      to={`/${derivedGender || pathname.replace('/', '')}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      ← Back to {derivedGender ? `${derivedGender.charAt(0).toUpperCase() + derivedGender.slice(1)}'s Collection` : 'Collection'}
                    </Link>
                  ) : null}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;