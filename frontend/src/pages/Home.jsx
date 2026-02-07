import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
// import Footer from '../components/Footer'; 
import ProductCard from '../components/ProductCard';
import InstagramReels from '../components/InstagramReels';
import { productAPI } from '../utils/api';
import { handleImageError } from '../utils/imageFallback';

// --- ICONS (Embedded directly so no install needed) ---
const IconChevronLeft = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>;
const IconChevronRight = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>;
const IconClose = () => <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;

// --- API FETCH FUNCTIONS (Kept from previous version) ---
const fetchFreshDrops = async () => {
  try {
    const [menShoes, womenShoes, accessories, watches, lenses, mensLenses] = await Promise.all([
      productAPI.getMenItems({ limit: 10, category: 'shoes' }),
      productAPI.getWomenItems({ limit: 10, category: 'shoes' }),
      productAPI.getAccessories({ limit: 10 }),
      productAPI.getWatches({ limit: 10 }),
      productAPI.getLenses({ limit: 10 }),
      productAPI.getLenses({ limit: 10, gender: 'men' })
    ]);

    // Combine shoes from men and women, take exactly 12
    let allShoes = [];
    if (menShoes.success && menShoes.data.products) {
      allShoes = [...allShoes, ...menShoes.data.products];
    }
    if (womenShoes.success && womenShoes.data.products) {
      allShoes = [...allShoes, ...womenShoes.data.products];
    }
    const shoes = allShoes.slice(0, 12);

    // Get exactly 10 accessories
    const acc = accessories.success && accessories.data.products
      ? accessories.data.products.slice(0, 10)
      : [];

    // Get exactly 10 watches
    const watch = watches.success && watches.data.products
      ? watches.data.products.slice(0, 10)
      : [];

    // Get exactly 10 lenses
    const lens = lenses.success && lenses.data.products
      ? lenses.data.products.slice(0, 10)
      : [];

    // Get exactly 10 men's lenses
    const mensLens = mensLenses.success && mensLenses.data.products
      ? mensLenses.data.products.slice(0, 10)
      : [];

    // Combine all: 12 shoes + 10 accessories + 10 watches + 10 lenses + 10 men's lenses = 52 products total
    return [...shoes, ...acc, ...watch, ...lens, ...mensLens];
  } catch (error) {
    console.error("Error fetching fresh drops:", error);
    return [];
  }
};

const fetchSaleItems = async () => {
  const res = await productAPI.getAllProducts({ limit: 4, onSale: true, sort: 'discountPercent', order: 'desc' });
  return res.success ? res.data.products : [];
};

const fetchMen = async () => {
  const res = await productAPI.getMenItems({ limit: 4 });
  return res.success ? res.data.products : [];
};

const fetchWomen = async () => {
  const res = await productAPI.getWomenItems({ limit: 4 });
  return res.success ? res.data.products : [];
};

const fetchWatches = async () => {
  const res = await productAPI.getWatches({ limit: 4 });
  return res.success ? res.data.products : [];
};

const fetchMensWatches = async () => {
  const res = await productAPI.getWatches({ limit: 4, gender: 'men' });
  return res.success ? res.data.products : [];
};

const fetchWomensWatches = async () => {
  const res = await productAPI.getWatches({ limit: 4, gender: 'women' });
  return res.success ? res.data.products : [];
};

const fetchAccessories = async () => {
  try {
    const [lenses, acc] = await Promise.all([
      productAPI.getLenses({ limit: 2 }),
      productAPI.getAccessories({ limit: 2 })
    ]);
    let combined = [];
    if (lenses.success) combined = [...combined, ...lenses.data.products];
    if (acc.success) combined = [...combined, ...acc.data.products];
    return combined.slice(0, 4);
  } catch (error) {
    console.error("Error fetching accessories:", error);
    return [];
  }
};

const LuxeSection = () => {
  const scrollRef = useRef(null);

  // Sample data to match the image aesthetics
  const luxeProducts = [
    {
      id: 1,
      brand: "CLINIQUE",
      image: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=800&auto=format&fit=crop",
      link: "/luxe/clinique"
    },
    {
      id: 2,
      brand: "RABANNE",
      image: "https://images.unsplash.com/photo-1594035910387-fea4779426e9?q=80&w=800&auto=format&fit=crop",
      link: "/luxe/rabanne"
    },
    {
      id: 3,
      brand: "ISSEY MIYAKE",
      image: "https://images.unsplash.com/photo-1585232561025-aa543d3122c4?q=80&w=800&auto=format&fit=crop",
      link: "/luxe/issey"
    },
    {
      id: 4,
      brand: "VERSACE",
      image: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?q=80&w=800&auto=format&fit=crop",
      link: "/luxe/versace"
    },
  ];
}

const scroll = (direction) => {
  if (scrollRef.current) {
    const { current } = scrollRef;
    const scrollAmount = 300; // Adjust scroll distance
    if (direction === 'left') {
      current.scrollLeft -= scrollAmount;
    } else {
      current.scrollLeft += scrollAmount;
    }
  }
};



// --- NEWS TICKER COMPONENT (New) ---
const NewsTicker = () => {
  const marqueeContent = "★ SALE IS LIVE — UP TO 50% OFF ★ | ◆ FREE SHIPPING ON ORDERS OVER ₹999 ◆ | ● NEW ARRIVALS EVERY WEEK ● | ♦ EXTRA 10% OFF ON FIRST ORDER ♦";

  // NOTE: For the 'continuous' marquee animation, this CSS needs to be applied.
  // In a real project, place this CSS in your global stylesheet (e.g., index.css).
  // For a self-contained solution, we use the <style> tag here.

  return (
    <>

      <style>
        {`
            @keyframes marquee {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
            }
            .animate-marquee {
                animation: marquee 30s linear infinite;
                background-colour: black;
            }
            `}
      </style>
      <div className="overflow-hidden bg-black text-white py-3 border-b border-gray-700">
        <div className="whitespace-nowrap w-[200%] flex animate-marquee">
          {/* Duplicate content to ensure seamless loop */}
          <span className="text-sm font-medium tracking-wider mx-8">{marqueeContent}</span>
          <span className="text-sm font-medium tracking-wider mx-8" aria-hidden="true">{marqueeContent}</span>
        </div>
      </div>
    </>
  );
};


const Home = () => {
  // --- UI STATE ---
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const categoryScrollRef = useRef(null);
  const lifestyleScrollRef = useRef(null);

  // --- DATA STATE & FETCHING (Unchanged) ---
  const [freshDrops, setFreshDrops] = useState([]);
  const [saleItems, setSaleItems] = useState([]);
  const [menItems, setMenItems] = useState([]);
  const [womenItems, setWomenItems] = useState([]);
  const [watches, setWatches] = useState([]);
  const [accessories, setAccessories] = useState([]);
  const [mensWatches, setMensWatches] = useState([]);
  const [womensWatches, setWomensWatches] = useState([]);

  useEffect(() => {
    const loadAllData = async () => {
      setIsLoading(true);
      try {
        const [freshDropsData, saleData, menData, womenData, watchesData, accessoriesData, mensWatchesData, womensWatchesData] = await Promise.all([
          fetchFreshDrops(), fetchSaleItems(), fetchMen(), fetchWomen(), fetchWatches(), fetchAccessories(), fetchMensWatches(), fetchWomensWatches()
        ]);
        setFreshDrops(freshDropsData);
        setSaleItems(saleData);
        setMenItems(menData);
        setWomenItems(womenData);
        setWatches(watchesData);
        setAccessories(accessoriesData);
        setMensWatches(mensWatchesData);
        setWomensWatches(womensWatchesData);
      } catch (error) {
        console.error("Error loading home page data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadAllData();
  }, []);

  const carouselSlides = [
    { image: 'https://res.cloudinary.com/daxdjob49/image/upload/f_auto,q_auto,w_1920/v1770261032/image_ua7yjh.jpg', link: '/' }
  ];

  // --- CAROUSEL LOGIC ---
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [carouselSlides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
  const goToSlide = (index) => setCurrentSlide(index);

  return (
    <div className="min-h-screen bg-[#F7F4EE] font-sans text-gray-800">

      {/* --- HERO SECTION (Restored & Top Margin Removed) --- */}
      <div className="relative w-full overflow-hidden group">
        <div className="hidden lg:block relative w-full">
          <div className="relative w-full" style={{ aspectRatio: '2161/771' }}>
            {carouselSlides.map((slide, index) => (
              <Link
                to={slide.link}
                key={index}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
              >
                <img
                  src={slide.image}
                  alt="Banner"
                  className="w-full h-full object-cover"
                  loading={index === 0 ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "high" : "low"}
                  decoding="async"
                  onError={(e) => handleImageError(e, 2161, 771)}
                />
              </Link>
            ))}
          </div>
          {/* Controls */}
          <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/90 text-gray-800 hover:bg-white shadow-lg transition opacity-0 group-hover:opacity-100 transform hover:scale-110">
            <IconChevronLeft />
          </button>
          <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/90 text-gray-800 hover:bg-white shadow-lg transition opacity-0 group-hover:opacity-100 transform hover:scale-110">
            <IconChevronRight />
          </button>
          {/* Indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
            {carouselSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-1.5 rounded-full transition-all duration-300 shadow-sm ${index === currentSlide ? 'w-8 bg-gray-800' : 'w-2 bg-gray-400 hover:bg-gray-600'}`}
              />
            ))}
          </div>
        </div>
        {/* Mobile Banner */}
        <div className="block lg:hidden w-full">
          <Link to="/sale">
            <img 
              src="https://res.cloudinary.com/daxdjob49/image/upload/v1770461279/b9b6c7c0-6754-41c0-82ff-bdb204d2aff3.png" 
              alt="Mobile Banner" 
              className="w-full h-auto object-cover block" 
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </Link>
        </div>
      </div>

      {/* --- NEWS TICKER SECTION (New Continuous Marquee) --- */}
      <NewsTicker />

      {/* <section className="py-5 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Shop by Category</h2>
              <p className="text-gray-500 mt-2 font-light">Curated essentials for the modern wardrobe.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                id: 'men',
                label: 'MEN',
                sub: 'The Gentleman\'s Edit',
                image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=600&auto=format&fit=crop'
              },
              {
                id: 'women',
                label: 'WOMEN',
                sub: 'Elegance Redefined',
                image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop'
              },
              {
                id: 'watches',
                label: 'WATCHES',
                sub: 'Timeless Luxury',
                image: 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=600&auto=format&fit=crop'
              },
              {
                id: 'accessories',
                label: 'ACCESSORIES',
                sub: 'Finishing Touches',
                image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=600&auto=format&fit=crop'
              }
            ].map((cat) => (
              <Link
                key={cat.id}
                to={`/${cat.id}`}
                className="group relative block h-96 overflow-hidden rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500"
              >
                
                <img
                  src={cat.image}
                  alt={cat.label}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  loading="lazy"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500"></div>

              
                <div className="absolute bottom-4 left-4 right-4 p-5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg transition-all duration-300 group-hover:bg-white/20 group-hover:bottom-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-bold text-white tracking-widest">{cat.label}</h3>
                      <p className="text-gray-200 text-xs mt-1 font-medium">{cat.sub}</p>
                    </div>

                    
                    <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center transform translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section> */}

      {/* --- SHOP BY CATEGORY SECTION --- */}
      <section className="pt-10 pb-4 md:pt-16 md:pb-6 bg-[#F7F4EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
              Shop By Category
            </h2>
            <p className="text-gray-500 mt-1.5 text-sm">Explore our curated collections</p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
            {[
              { 
                label: "Men's Watches", 
                path: '/mens-watches', 
                image: 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=400&auto=format&fit=crop',
                bgColor: 'bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100'
              },
              { 
                label: "Women's Watches", 
                path: '/womens-watches', 
                image: 'https://www.titan.co.in/dw/image/v2/BKDD_PRD/on/demandware.static/-/Sites-titan-master-catalog/default/dw5487e70b/images/Titan/Catalog/2606WM08_1.jpg?sw=400&sh=400',
                bgColor: 'bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-100'
              },
              { 
                label: "Men's Wallet", 
                path: '/mens-wallet', 
                image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=400&auto=format&fit=crop',
                bgColor: 'bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100'
              },
              { 
                label: "Women's Wallet", 
                path: '/womens-wallet', 
                image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=400&auto=format&fit=crop',
                bgColor: 'bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-100'
              },
              { 
                label: "Men's Belt", 
                path: '/mens-belts', 
                image: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=400&auto=format&fit=crop',
                bgColor: 'bg-gradient-to-br from-emerald-50 via-green-50 to-teal-100'
              },
              { 
                label: "Women's Belt", 
                path: '/womens-belt', 
                image: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=400&auto=format&fit=crop',
                bgColor: 'bg-gradient-to-br from-pink-50 via-rose-50 to-red-100'
              },
              { 
                label: "Men's Perfumes", 
                path: '/mens-perfumes', 
                image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=400&auto=format&fit=crop',
                bgColor: 'bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100'
              },
              { 
                label: "Women's Perfumes", 
                path: '/womens-perfumes', 
                image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=400&auto=format&fit=crop',
                bgColor: 'bg-gradient-to-br from-cyan-50 via-teal-50 to-emerald-100'
              }
            ].map((cat) => (
              <Link
                key={cat.path}
                to={cat.path}
                className={`group relative flex flex-col items-center text-center rounded-2xl ${cat.bgColor} p-4 md:p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
              >
                {/* Category Name */}
                <h3 className="text-sm md:text-base font-semibold text-gray-800 mb-0.5 leading-tight">
                  {cat.label}
                </h3>
                
                {/* Premium Collection Text */}
                <p className="text-[10px] md:text-xs text-gray-500 mb-3 md:mb-4">
                  Premium collection
                </p>
                
                {/* Product Image */}
                <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-xl overflow-hidden bg-white/60 shadow-sm">
                  <img
                    src={cat.image}
                    alt={cat.label}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                  />
                </div>
                
                {/* Shop Now Link */}
                <div className="mt-3 md:mt-4 flex items-center text-blue-600 font-medium text-xs md:text-sm group-hover:text-blue-700 transition-colors">
                  <span>Shop Now</span>
                  <svg className="w-3.5 h-3.5 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram Reels Section */}
      <InstagramReels />

      {/* Banner Section */}
      <section className="w-full bg-[#F7F4EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="overflow-hidden rounded-xl shadow-md">
            <img
              src="https://hotgadget.in/cdn/shop/files/65_34eeecb0-6ddd-487f-ba48-e52ebcc2ba85.jpg?v=1769032871&width=1920"
              alt="Special Offer Banner"
              className="w-full h-auto object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Top Selling Men's Watches Section */}
      <ProductSection
        title="Top Selling Men's Watches"
        subtitle="Premium timepieces for the modern gentleman"
        products={mensWatches}
        viewAllLink="/mens-watches"
        isLoading={isLoading}
      />

      {/* Top Selling Women's Watches Section */}
      <ProductSection
        title="Top Selling Women's Watches"
        subtitle="Elegant watches for every occasion"
        products={womensWatches}
        viewAllLink="/womens-watches"
        isLoading={isLoading}
      />

    </div>
  );
};

// --- REUSABLE SUB-COMPONENTS ---

const SkeletonCard = () => <div className="h-64 bg-gray-200 animate-pulse rounded-xl"></div>;

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



export default Home;