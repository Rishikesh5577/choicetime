// Ensure API_BASE_URL always ends with /api if not already present
const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl) {
    // If env var is set, ensure it ends with /api
    return envUrl.endsWith('/api') ? envUrl : `${envUrl.replace(/\/$/, '')}/api`;
  }
  // Default to port 5008 (or 5000 if backend is on 5000)
  return 'http://localhost:5008/api';
};

const API_BASE_URL = getApiBaseUrl();

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    // Ensure endpoint starts with / for proper URL construction
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const fullUrl = `${API_BASE_URL}${normalizedEndpoint}`;
    
    // Debug log in development
    if (import.meta.env.DEV) {
      console.log(`[API Request] ${options.method || 'GET'} ${fullUrl}`);
    }
    
    const response = await fetch(fullUrl, config);
    
    // Check if response is JSON before parsing
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      // If not JSON (e.g., HTML error page), read as text for better error message
      const text = await response.text();
      console.error(`Non-JSON response from ${endpoint}:`, text.substring(0, 200));
      
      // Create a meaningful error
      const error = new Error(
        response.status === 404 
          ? `Route not found: ${endpoint}` 
          : `Server returned ${response.status}: ${response.statusText}`
      );
      error.response = { 
        status: response.status, 
        statusText: response.statusText,
        data: { message: `Expected JSON but received ${contentType || 'unknown content type'}` }
      };
      throw error;
    }

    if (!response.ok) {
      // Create error with response data attached
      const error = new Error(data.message || 'Something went wrong');
      error.response = { data, status: response.status };
      throw error;
    }

    return data;
  } catch (error) {
    // If it's already our custom error, re-throw it
    if (error.response) {
      throw error;
    }
    // Otherwise, wrap it
    throw error;
  }
};

// Auth API calls
export const authAPI = {
  signup: async (userData) => {
    return apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  login: async (email, password) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  sendOTP: async (phone) => {
    return apiRequest('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    });
  },

  verifyOTP: async (phone, otp, name = null, email = null) => {
    return apiRequest('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, otp, name, email }),
    });
  },

  getMe: async () => {
    return apiRequest('/auth/me');
  },
};

// Cart API calls
export const cartAPI = {
  getCart: async () => {
    return apiRequest('/cart');
  },

  addToCart: async (product, quantity = 1, size = '', color = '') => {
    return apiRequest('/cart/add', {
      method: 'POST',
      body: JSON.stringify({ product, quantity, size, color }),
    });
  },

  updateCartItem: async (itemId, quantity) => {
    return apiRequest(`/cart/update/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  },

  removeFromCart: async (itemId) => {
    return apiRequest(`/cart/remove/${itemId}`, {
      method: 'DELETE',
    });
  },

  clearCart: async () => {
    return apiRequest('/cart/clear', {
      method: 'DELETE',
    });
  },
};

// Order API calls
export const orderAPI = {
  getOrders: async () => {
    return apiRequest('/orders');
  },

  getOrder: async (orderId) => {
    return apiRequest(`/orders/${orderId}`);
  },

  createOrder: async (shippingAddress, paymentMethod = 'COD') => {
    return apiRequest('/orders/create', {
      method: 'POST',
      body: JSON.stringify({ shippingAddress, paymentMethod }),
    });
  },
};

// Payment API calls
export const paymentAPI = {
  createRazorpayOrder: async (shippingAddress) => {
    return apiRequest('/payment/create-order', {
      method: 'POST',
      body: JSON.stringify({ shippingAddress }),
    });
  },

  verifyPayment: async (razorpay_order_id, razorpay_payment_id, razorpay_signature) => {
    return apiRequest('/payment/verify-payment', {
      method: 'POST',
      body: JSON.stringify({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      }),
    });
  },
};

// Profile API calls
export const profileAPI = {
  getProfile: async () => {
    return apiRequest('/profile');
  },

  updateProfile: async (data) => {
    return apiRequest('/profile/update', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

// Product API calls
export const productAPI = {
  getWatches: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/products/watches${queryString ? `?${queryString}` : ''}`);
  },

  getWatchById: async (id) => {
    return apiRequest(`/products/watches/${id}`);
  },

  getLenses: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/products/lens${queryString ? `?${queryString}` : ''}`);
  },

  getLensById: async (id) => {
    return apiRequest(`/products/lens/${id}`);
  },

  getAccessories: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/products/accessories${queryString ? `?${queryString}` : ''}`);
  },

  getAccessoryById: async (id) => {
    return apiRequest(`/products/accessories/${id}`);
  },

  getMenItems: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/products/men${queryString ? `?${queryString}` : ''}`);
  },

  getMenItemById: async (id) => {
    return apiRequest(`/products/men/${id}`);
  },

  getWomenItems: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/products/women${queryString ? `?${queryString}` : ''}`);
  },

  getWomenItemById: async (id) => {
    return apiRequest(`/products/women/${id}`);
  },

  // Helper to get all products from all categories
  getAllProducts: async (params = {}) => {
    try {
      const [watches, lenses, accessories, men, women] = await Promise.all([
        productAPI.getWatches(params),
        productAPI.getLenses(params),
        productAPI.getAccessories(params),
        productAPI.getMenItems(params),
        productAPI.getWomenItems(params),
      ]);

      const allProducts = [
        ...(watches.success ? watches.data.products : []),
        ...(lenses.success ? lenses.data.products : []),
        ...(accessories.success ? accessories.data.products : []),
        ...(men.success ? men.data.products : []),
        ...(women.success ? women.data.products : []),
      ];

      return {
        success: true,
        data: { products: allProducts },
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: { products: [] },
      };
    }
  },
};

export const adminAPI = {
  getSummary: async () => apiRequest('/admin/summary'),
  getOrders: async () => apiRequest('/admin/orders'),
  updateOrderStatus: async (orderId, status) =>
    apiRequest(`/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  deleteOrder: async (orderId) =>
    apiRequest(`/admin/orders/${orderId}`, { method: 'DELETE' }),
  getProducts: async (category) => {
    const query = category ? `?category=${encodeURIComponent(category)}` : '';
    return apiRequest(`/admin/products${query}`);
  },
  createProduct: async (payload) =>
    apiRequest('/admin/products', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateProduct: async (id, payload) =>
    apiRequest(`/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  deleteProduct: async (id, category) => {
    const query = category ? `?category=${encodeURIComponent(category)}` : '';
    return apiRequest(`/admin/products/${id}${query}`, { method: 'DELETE' });
  },
  getUsers: async () => apiRequest('/admin/users'),
  deleteUser: async (userId) =>
    apiRequest(`/admin/users/${userId}`, { method: 'DELETE' }),
  getCategories: async () => apiRequest('/admin/categories'),
  createCategory: async (payload) =>
    apiRequest('/admin/categories', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateCategory: async (id, payload) =>
    apiRequest(`/admin/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  deleteCategory: async (id) =>
    apiRequest(`/admin/categories/${id}`, { method: 'DELETE' }),
  addSubcategory: async (categoryId, payload) =>
    apiRequest(`/admin/categories/${categoryId}/subcategories`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  removeSubcategory: async (categoryId, subId) =>
    apiRequest(`/admin/categories/${categoryId}/subcategories/${subId}`, {
      method: 'DELETE',
    }),
};

// Review API calls
export const reviewAPI = {
  getReviews: async (productId, sort = 'newest', limit = 50) => {
    return apiRequest(`/reviews/${productId}?sort=${sort}&limit=${limit}`);
  },

  createReview: async (reviewData) => {
    return apiRequest('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  },

  markHelpful: async (reviewId) => {
    return apiRequest(`/reviews/${reviewId}/helpful`, {
      method: 'PUT',
    });
  },
};

// Wishlist API calls
export const wishlistAPI = {
  getWishlist: async () => {
    return apiRequest('/wishlist');
  },

  addToWishlist: async (productId) => {
    return apiRequest('/wishlist/add', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    });
  },

  removeFromWishlist: async (productId) => {
    return apiRequest(`/wishlist/remove/${productId}`, {
      method: 'DELETE',
    });
  },

  checkWishlist: async (productId) => {
    return apiRequest(`/wishlist/check/${productId}`);
  },
};

// Public categories (for navbar - no auth required)
export const categoryAPI = {
  getCategories: async () => apiRequest('/categories'),
};

// Search API calls
export const searchAPI = {
  searchProducts: async (query, params = {}) => {
    const queryString = new URLSearchParams({ q: query, ...params }).toString();
    return apiRequest(`/search?${queryString}`);
  },
};

// Order Tracking API calls
export const trackingAPI = {
  trackOrder: async (orderId) => {
    return apiRequest(`/orders/track/${orderId}`);
  },
};

export default apiRequest;

