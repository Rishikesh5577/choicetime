import { Link } from 'react-router-dom';
import ProductCard from '../ProductCard';

const SkeletonCard = () => (
  <div className="h-64 bg-gray-200 animate-pulse rounded-xl"></div>
);

const ProductSection = ({ title, subtitle, products, viewAllLink, bgColor = 'bg-[#F7F4EE]', isLoading }) => {
  return (
    <section className={`py-16 ${bgColor}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8 border-b pb-4 border-gray-200">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900">{title}</h2>
            {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
          </div>
          {viewAllLink && (
            <Link
              to={viewAllLink}
              className="hidden sm:inline-block px-6 py-2 rounded-full border border-gray-300 font-semibold text-white bg-gray-900 hover:bg-gray-900 hover:text-white hover:border-transparent transform"
            >
              View All
            </Link>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products && products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <p className="col-span-4 text-center text-gray-500 py-10">No products found.</p>
            )}
          </div>
        )}

        {/* Mobile View All Button (Visible only on small screens) */}
        {viewAllLink && (
          <div className="mt-8 text-center sm:hidden">
            <Link to={viewAllLink} className="inline-block px-8 py-3 rounded-full bg-gray-900 text-white font-semibold shadow-lg">View All</Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductSection;
