// API utility functions for frontend to backend communication

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// Get auth token from localStorage
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Set auth token in localStorage
const setAuthToken = (token) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
};

// Remove auth token from localStorage
const removeAuthToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
};


// Generic API request function (with safer error handling)
const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}/api${endpoint}`, config);

    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');

    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      // If JSON, use error message from body; else use plain text or generic
      const errorMessage = typeof data === 'string' ? data : data?.error || 'API request failed';
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};


// Auth API functions
export const authAPI = {
  // Register user
  register: async (userData) => {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.token) {
      setAuthToken(response.token);
    }
    
    return response;
  },

  // Login user
  login: async (credentials) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.token) {
      setAuthToken(response.token);
    }
    
    return response;
  },

  // Logout user
  logout: async () => {
    try {
      await apiRequest('/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      removeAuthToken();
    }
  },

  // Get current user
  getCurrentUser: async () => {
    return await apiRequest('/auth/me');
  },
};

// Admin API functions
export const adminAPI = {
  // Dashboard
  getDashboard: async () => {
    return await apiRequest('/admin/dashboard');
  },

  // Boxes
  getBoxes: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiRequest(`/admin/boxes?${queryString}`);
  },

  getBox: async (id) => {
    return await apiRequest(`/admin/boxes/${id}`);
  },

  getBoxById: async (id) => {
    return await apiRequest(`/admin/boxes/${id}`);
  },

  createBox: async (boxData) => {
    return await apiRequest('/admin/boxes', {
      method: 'POST',
      body: JSON.stringify(boxData),
    });
  },

  updateBox: async (id, boxData) => {
    return await apiRequest(`/admin/boxes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(boxData),
    });
  },

  deleteBox: async (id) => {
    return await apiRequest(`/admin/boxes/${id}`, {
      method: 'DELETE',
    });
  },

  // Orders
  getOrders: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiRequest(`/admin/orders?${queryString}`);
  },

  getOrder: async (id) => {
    return await apiRequest(`/admin/orders/${id}`);
  },

  updateOrder: async (id, orderData) => {
    return await apiRequest(`/admin/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(orderData),
    });
  },

  addTrackingUpdate: async (id, trackingData) => {
    return await apiRequest(`/admin/orders/${id}`, {
      method: 'POST',
      body: JSON.stringify(trackingData),
    });
  },

  // Customers
  getCustomers: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiRequest(`/admin/customers?${queryString}`);
  },

  // Influencers (admin)
  getInfluencers: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiRequest(`/admin/influencers?${queryString}`);
  },
  createInfluencer: async (data) => {
    return await apiRequest(`/admin/influencers`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  updateInfluencer: async (id, data) => {
    return await apiRequest(`/admin/influencers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  deleteInfluencer: async (id) => {
    return await apiRequest(`/admin/influencers/${id}`, {
      method: 'DELETE',
    });
  },

  // Support
  getSupportTickets: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiRequest(`/admin/support?${queryString}`);
  },

  replyToTicket: async (ticketId, messageData) => {
    return await apiRequest(`/admin/support/${ticketId}/reply`, {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  },

  getSupportTicket: async (id) => {
    return await apiRequest(`/admin/support/${id}`);
  },

  updateSupportTicket: async (id, updateData) => {
    return await apiRequest(`/admin/support/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },
};

// User API functions
export const userAPI = {
  // Profile
  getProfile: async () => {
    return await apiRequest('/user/profile');
  },

  updateProfile: async (profileData) => {
    return await apiRequest('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  // Orders
  getOrders: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiRequest(`/user/orders?${queryString}`);
  },

  getOrder: async (id) => {
    return await apiRequest(`/user/orders/${id}`);
  },

  // Addresses
  getAddresses: async () => {
    return await apiRequest('/user/addresses');
  },

  createAddress: async (addressData) => {
    return await apiRequest('/user/addresses', {
      method: 'POST',
      body: JSON.stringify(addressData),
    });
  },

  updateAddress: async (id, addressData) => {
    return await apiRequest(`/user/addresses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(addressData),
    });
  },

  deleteAddress: async (id) => {
    return await apiRequest(`/user/addresses/${id}`, {
      method: 'DELETE',
    });
  },

  // Support
  getSupportTickets: async () => {
    return await apiRequest('/user/support');
  },

  createSupportTicket: async (ticketData) => {
    return await apiRequest('/user/support', {
      method: 'POST',
      body: JSON.stringify(ticketData),
    });
  },

  addMessage: async (ticketId, messageData) => {
    return await apiRequest(`/user/support/${ticketId}/messages`, {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  },

  // Wishlist
  getWishlist: async () => {
    return await apiRequest('/user/wishlist');
  },

  addToWishlist: async (boxId) => {
    return await apiRequest('/user/wishlist', {
      method: 'POST',
      body: JSON.stringify({ boxId }),
    });
  },

  removeFromWishlist: async (itemId) => {
    return await apiRequest(`/user/wishlist?itemId=${itemId}`, {
      method: 'DELETE',
    });
  },
};

// Public API functions
export const publicAPI = {
  // Boxes
  getBoxes: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiRequest(`/boxes?${queryString}`);
  },

  getBox: async (slug) => {
    return await apiRequest(`/boxes/${slug}`);
  },

   getReviews: async (slug) => {
    const res = await fetch(`/api/boxes/${slug}/reviews`);
    if (!res.ok) throw new Error('Reviews fetch failed');
    return res.json();
  },

  getRelatedBoxes: async (slug) => {
    const res = await fetch(`/api/boxes/${slug}/related`);
    if (!res.ok) throw new Error('Related boxes fetch failed');
    return res.json();
  },

  // Categories
  getCategories: async () => {
    return await apiRequest('/categories');
  },

  // Contact
  sendContactMessage: async (messageData) => {
    return await apiRequest('/contact', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  },

  // Influencer
  sendInfluencerRequest: async (requestData) => {
    return await apiRequest('/influencers', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  },
};

// Cart and Checkout API functions
export const cartAPI = {
  // Cart
  getCart: async () => {
    return await apiRequest('/cart');
  },

  addToCart: async (itemData) => {
    return await apiRequest('/cart', {
      method: 'POST',
      body: JSON.stringify(itemData),
    });
  },

  updateCartItem: async (itemId, quantity) => {
    return await apiRequest(`/cart/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  },

  removeFromCart: async (itemId) => {
    return await apiRequest(`/cart/${itemId}`, {
      method: 'DELETE',
    });
  },

  // Checkout
  createOrder: async (orderData) => {
    return await apiRequest('/checkout', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  uploadPaymentProof: async (orderId, paymentData) => {
    return await apiRequest(`/orders/${orderId}/payment`, {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  },
};

// Utility functions
export const isAuthenticated = () => {
  return !!getAuthToken();
};

export const isAdmin = () => {
  // This would need to be implemented based on user role
  // For now, we'll check if there's a token
  return !!getAuthToken();
};

// Boxes API functions (alias for publicAPI)
export const boxesAPI = publicAPI;

export default {
  auth: authAPI,
  admin: adminAPI,
  user: userAPI,
  public: publicAPI,
  cart: cartAPI,
  boxes: boxesAPI,
  isAuthenticated,
  isAdmin,
}; 