import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { wishlistAPI } from '../utils/api';

const LOCAL_WISHLIST_KEY = 'local_wishlist_ids';

const getLocalWishlist = () => {
  try {
    const stored = localStorage.getItem(LOCAL_WISHLIST_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (err) {
    console.error('Error reading local wishlist:', err);
    return [];
  }
};

const saveLocalWishlist = (ids) => {
  try {
    localStorage.setItem(LOCAL_WISHLIST_KEY, JSON.stringify(ids));
  } catch (err) {
    console.error('Error saving local wishlist:', err);
  }
};

const WishlistContext = createContext();
const WISHLIST_API_DISABLED_KEY = 'wishlist_api_disabled';

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [wishlistApiAvailable, setWishlistApiAvailable] = useState(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_API_DISABLED_KEY);
      return stored === 'true' ? false : true;
    } catch {
      return true;
    }
  });

  // Load wishlist when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadWishlist();
    } else {
      setWishlist([]);
      setWishlistIds(new Set());
    }
  }, [isAuthenticated]);

  const setLocalWishlistState = (ids) => {
    const uniqueIds = Array.from(new Set(ids));
    setWishlistIds(new Set(uniqueIds));
    setWishlist(uniqueIds.map(id => ({ productId: id })));
    saveLocalWishlist(uniqueIds);
  };

  const loadWishlist = async () => {
    if (!isAuthenticated) return;
    if (!wishlistApiAvailable) {
      const localIds = getLocalWishlist();
      setLocalWishlistState(localIds);
      return;
    }
    
    setLoading(true);
    try {
      const response = await wishlistAPI.getWishlist();
      if (response.success) {
        const items = response.data.wishlist || [];
        setWishlist(items);
        setWishlistIds(new Set(items.map(item => item.productId || item.product?._id || item.product?.id)));
        saveLocalWishlist(items.map(item => item.productId || item.product?._id || item.product?.id));
      }
    } catch (error) {
      // Silently fall back to local storage when API route is missing
      setWishlistApiAvailable(false);
      try { localStorage.setItem(WISHLIST_API_DISABLED_KEY, 'true'); } catch {}
      const localIds = getLocalWishlist();
      setLocalWishlistState(localIds);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId) => {
    if (!isAuthenticated) {
      throw new Error('Please login to add items to wishlist');
    }

    try {
      if (!wishlistApiAvailable) {
        setLocalWishlistState([...wishlistIds, productId]);
        return true;
      }

      const response = await wishlistAPI.addToWishlist(productId);
      if (response.success) {
        setWishlistIds(prev => new Set([...prev, productId]));
        await loadWishlist();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      // Fallback to local storage if API is not available
      setWishlistApiAvailable(false);
      try { localStorage.setItem(WISHLIST_API_DISABLED_KEY, 'true'); } catch {}
      setLocalWishlistState([...wishlistIds, productId]);
      return true;
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!isAuthenticated) return false;

    try {
      if (!wishlistApiAvailable) {
        setLocalWishlistState([...wishlistIds].filter(id => id !== productId));
        return true;
      }

      const response = await wishlistAPI.removeFromWishlist(productId);
      if (response.success) {
        const updated = [...wishlistIds].filter(id => id !== productId);
        setLocalWishlistState(updated);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      // Fallback to local storage if API is not available
      setWishlistApiAvailable(false);
      try { localStorage.setItem(WISHLIST_API_DISABLED_KEY, 'true'); } catch {}
      setLocalWishlistState([...wishlistIds].filter(id => id !== productId));
      return true;
    }
  };

  const toggleWishlist = async (productId) => {
    if (isInWishlist(productId)) {
      return await removeFromWishlist(productId);
    } else {
      return await addToWishlist(productId);
    }
  };

  const isInWishlist = (productId) => {
    return wishlistIds.has(productId);
  };

  const getWishlistCount = () => {
    return wishlist.length;
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistIds,
        loading,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        getWishlistCount,
        loadWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

