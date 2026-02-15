import { useState, useEffect } from 'react';
import { productAPI, categoriesAPI } from '../utils/api';

// --- Home Page Section Components ---
import HeroCarousel from '../components/home/HeroCarousel';
import NewsTicker from '../components/home/NewsTicker';
import ShopByCategory from '../components/home/ShopByCategory';
import SubcategoryMarquee from '../components/home/SubcategoryMarquee';
import ProductSection from '../components/home/ProductSection';
import InstagramReels from '../components/InstagramReels';
const HOME_CACHE_KEY = 'homePage_topSelling';
const HOME_CACHE_TIME_KEY = 'homePage_topSelling_timestamp';
const CACHE_DURATION_MS = 10 * 60 * 1000; // 10 minutes

/** Fetch top-selling products (limit 8) for a single category */
const fetchTopSellingForCategory = async (categorySlug) => {
  try {
    const res = await productAPI.getProducts(categorySlug, { limit: 8 });
    return res.success && res.data?.products ? res.data.products : [];
  } catch (error) {
    console.error(`Error fetching top selling for ${categorySlug}:`, error);
    return [];
  }
};

// --- MAIN HOME COMPONENT ---
const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [topSellingByCategory, setTopSellingByCategory] = useState([]);

  useEffect(() => {
    const loadAllData = async () => {
      setIsLoading(true);
      let data = null;
      const now = Date.now();
      const cached = localStorage.getItem(HOME_CACHE_KEY);
      const cachedTime = localStorage.getItem(HOME_CACHE_TIME_KEY);
      if (cached && cachedTime) {
        const age = now - parseInt(cachedTime, 10);
        if (age < CACHE_DURATION_MS) {
          try {
            const parsed = JSON.parse(cached);
            if (parsed && Array.isArray(parsed)) data = parsed;
          } catch (e) {
            console.error('Error reading home page cache:', e);
          }
        }
      }
      if (data === null) {
        try {
          const categoriesRes = await categoriesAPI.getCategories();
          const cats = categoriesRes?.success && categoriesRes?.data?.categories?.length
            ? categoriesRes.data.categories
            : [];
          data = await Promise.all(
            cats.map(async (cat) => {
              const products = await fetchTopSellingForCategory(cat.id);
              return { category: cat, products };
            })
          );
          try {
            localStorage.setItem(HOME_CACHE_KEY, JSON.stringify(data));
            localStorage.setItem(HOME_CACHE_TIME_KEY, Date.now().toString());
          } catch (e) {
            console.error('Error saving home page cache:', e);
          }
        } catch (error) {
          console.error("Error loading home page data:", error);
          data = [];
        }
      }
      setTopSellingByCategory(data || []);
      setIsLoading(false);
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

      {/* One Top Selling section per category */}
      {topSellingByCategory.map(({ category, products }) => (
        <ProductSection
          key={category.id}
          title={`${category.label} - Top Selling`}
          subtitle="Best sellers in this category"
          products={products}
          viewAllLink={category.path}
          isLoading={false}
        />
      ))}

    </div>
  );
};

export default Home;
