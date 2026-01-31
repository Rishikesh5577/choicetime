const RECENTLY_VIEWED_KEY = 'recently_viewed_products';
const MAX_RECENT_ITEMS = 20;

export const recentlyViewed = {
  add: (product) => {
    try {
      const items = recentlyViewed.getAll();
      const productId = product._id || product.id;
      
      // Remove if already exists
      const filtered = items.filter(item => (item._id || item.id) !== productId);
      
      // Add to beginning
      const updated = [product, ...filtered].slice(0, MAX_RECENT_ITEMS);
      
      localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving recently viewed:', error);
    }
  },

  getAll: () => {
    try {
      const data = localStorage.getItem(RECENTLY_VIEWED_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading recently viewed:', error);
      return [];
    }
  },

  clear: () => {
    try {
      localStorage.removeItem(RECENTLY_VIEWED_KEY);
    } catch (error) {
      console.error('Error clearing recently viewed:', error);
    }
  },
};

