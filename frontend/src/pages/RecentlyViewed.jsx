import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { recentlyViewed } from '../utils/recentlyViewed';

const RecentlyViewed = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const items = recentlyViewed.getAll();
    setProducts(items);
  }, []);

  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No recently viewed products</h3>
            <p className="text-gray-600 mb-4">Start browsing to see your recently viewed items here</p>
            <Link to="/" className="inline-block px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800">
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Recently Viewed</h1>
            <p className="text-gray-600 mt-1">{products.length} product{products.length !== 1 ? 's' : ''}</p>
          </div>
          <button
            onClick={() => {
              recentlyViewed.clear();
              setProducts([]);
            }}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id || product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentlyViewed;

