import { useState, useEffect } from 'react';
import { productAPI } from '../utils/api';

// --- Home Page Section Components ---
import HeroCarousel from '../components/home/HeroCarousel';
import NewsTicker from '../components/home/NewsTicker';
import ShopByCategory from '../components/home/ShopByCategory';
import SubcategoryMarquee from '../components/home/SubcategoryMarquee';
import ProductSection from '../components/home/ProductSection';
import InstagramReels from '../components/InstagramReels';
import FAQSection from '../components/home/FAQSection';

// --- API FETCH FUNCTIONS ---
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

    let allShoes = [];
    if (menShoes.success && menShoes.data.products) {
      allShoes = [...allShoes, ...menShoes.data.products];
    }
    if (womenShoes.success && womenShoes.data.products) {
      allShoes = [...allShoes, ...womenShoes.data.products];
    }
    const shoes = allShoes.slice(0, 12);

    const acc = accessories.success && accessories.data.products
      ? accessories.data.products.slice(0, 10)
      : [];

    const watch = watches.success && watches.data.products
      ? watches.data.products.slice(0, 10)
      : [];

    const lens = lenses.success && lenses.data.products
      ? lenses.data.products.slice(0, 10)
      : [];

    const mensLens = mensLenses.success && mensLenses.data.products
      ? mensLenses.data.products.slice(0, 10)
      : [];

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

// --- MAIN HOME COMPONENT ---
const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [freshDrops, setFreshDrops] = useState([]);
  const [saleItems, setSaleItems] = useState([]);
  const [menItems, setMenItems] = useState([]);
  const [womenItems, setWomenItems] = useState([]);
  const [watches, setWatches] = useState([]);
  const [accessories, setAccessories] = useState([]);

  useEffect(() => {
    const loadAllData = async () => {
      setIsLoading(true);
      try {
        const [freshDropsData, saleData, menData, womenData, watchesData, accessoriesData] = await Promise.all([
          fetchFreshDrops(), fetchSaleItems(), fetchMen(), fetchWomen(), fetchWatches(), fetchAccessories()
        ]);
        setFreshDrops(freshDropsData);
        setSaleItems(saleData);
        setMenItems(menData);
        setWomenItems(womenData);
        setWatches(watchesData);
        setAccessories(accessoriesData);
      } catch (error) {
        console.error("Error loading home page data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadAllData();
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F4EE] font-sans text-gray-800">

      {/* Hero Banner Carousel */}
      <HeroCarousel />

      {/* Scrolling News Ticker */}
      <NewsTicker />

      {/* Shop By Category Grid */}
      <ShopByCategory />

      {/* Explore Collections - Subcategory Marquee */}
      <SubcategoryMarquee />

      {/* Instagram / Trending Reels */}
      <InstagramReels />

      {/* Latest Products */}
      <ProductSection
        title="Latest Products"
        subtitle="Discover our newest arrivals"
        products={freshDrops}
        viewAllLink="/sale"
        isLoading={isLoading}
      />

      {/* Frequently Asked Questions */}
      <FAQSection />

    </div>
  );
};

export default Home;
