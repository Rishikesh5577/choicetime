import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { wishlistAPI } from '../utils/api';

const WishlistContext = createContext();

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

  // Load wishlist from server when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadWishlist();
    } else {
      setWishlist([]);
      setWishlistIds(new Set());
    }
  }, [isAuthenticated]);

  const loadWishlist = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const response = await wishlistAPI.getWishlist();
      if (response.success) {
        const items = response.data.wishlist || [];
        setWishlist(items);
        setWishlistIds(new Set(items.map(item => item.productId || item.product?._id || item.product?.id)));
      }
    } catch (error) {
      console.error('Error loading wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId) => {
    if (!isAuthenticated) {
      throw new Error('Please login to add items to wishlist');
    }

    try {
      // Optimistic update
      setWishlistIds(prev => new Set([...prev, productId]));
      setWishlist(prev => [...prev, { productId }]);

      const response = await wishlistAPI.addToWishlist(productId);
      if (!response.success) {
        // Revert on failure
        await loadWishlist();
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      // Revert on failure
      await loadWishlist();
      return false;
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!isAuthenticated) return false;

    try {
      // Optimistic update
      setWishlistIds(prev => {
        const updated = new Set(prev);
        updated.delete(productId);
        return updated;
      });
      setWishlist(prev => prev.filter(item => (item.productId || item.product?._id) !== productId));

      const response = await wishlistAPI.removeFromWishlist(productId);
      if (!response.success) {
        await loadWishlist();
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      await loadWishlist();
      return false;
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
    return wishlistIds.size;
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
