import { Link } from 'react-router-dom';

const categories = [
  { 
    label: "Men's Watches", 
    path: '/mens-watches', 
    image: 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=400&auto=format&fit=crop'
  },
  { 
    label: "Women's Watches", 
    path: '/womens-watches', 
    image: 'https://www.titan.co.in/dw/image/v2/BKDD_PRD/on/demandware.static/-/Sites-titan-master-catalog/default/dw5487e70b/images/Titan/Catalog/2606WM08_1.jpg?sw=400&sh=400'
  },
  { 
    label: "Men's Wallet", 
    path: '/mens-wallet', 
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=400&auto=format&fit=crop'
  },
  { 
    label: "Men's Belt", 
    path: '/mens-belts', 
    image: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=400&auto=format&fit=crop'
  },
  { 
    label: "Men's Perfumes", 
    path: '/mens-perfumes', 
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=400&auto=format&fit=crop'
  },
  { 
    label: "Women's Perfumes", 
    path: '/womens-perfumes', 
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=400&auto=format&fit=crop'
  }
];

const ShopByCategory = () => {
  return (
    <section className="pt-10 md:pt-16 pb-4 md:pb-6 bg-[#F7F4EE]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 uppercase tracking-widest">
            Shop By Category
          </h2>
          <div className="mt-2 mx-auto w-12 h-0.5 bg-gray-800 rounded-full"></div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.path}
              to={cat.path}
              className="group flex flex-col items-center text-center"
            >
              {/* Square Image */}
              <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-white shadow-sm group-hover:shadow-xl transition-all duration-400 group-hover:-translate-y-1">
                <img
                  src={cat.image}
                  alt={cat.label}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                />
                {/* Subtle overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>
              </div>
              
              {/* Category Name */}
              <h3 className="mt-2.5 md:mt-3 text-[11px] sm:text-xs md:text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors leading-tight tracking-wide">
                {cat.label}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByCategory;
