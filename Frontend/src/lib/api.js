// API Configuration
// Ensure the URL ends with /api
let baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
if (baseURL && !baseURL.endsWith('/api')) {
  // If URL doesn't end with /api, append it
  baseURL = baseURL.endsWith('/') ? `${baseURL}api` : `${baseURL}/api`;
}
const API_BASE_URL = baseURL;

// Helper function to make API calls
async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('API Request:', url, config.method || 'GET');
    
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    // Provide more helpful error messages
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw new Error('Cannot connect to server. Please check if the backend is running and CORS is configured correctly.');
    }
    throw error;
  }
}

// Authentication
export async function login(email, password) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: { email, password },
  });
}

export async function register(userData) {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: userData,
  });
}

export async function getMe() {
  return apiRequest('/auth/me');
}

// Products
export async function getProducts(page = 1, limit = 20, filters = {}) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...filters,
  });
  return apiRequest(`/products?${params}`);
}

export async function getProduct(id) {
  return apiRequest(`/products/${id}`);
}

export async function createProduct(productData) {
  return apiRequest('/products', {
    method: 'POST',
    body: productData,
  });
}

export async function updateProduct(id, productData) {
  return apiRequest(`/products/${id}`, {
    method: 'PUT',
    body: productData,
  });
}

export async function deleteProduct(id) {
  return apiRequest(`/products/${id}`, {
    method: 'DELETE',
  });
}

// Orders
export async function getOrders(page = 1, limit = 20, filters = {}) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...filters,
  });
  return apiRequest(`/orders?${params}`);
}

export async function getOrder(id) {
  return apiRequest(`/orders/${id}`);
}

export async function createOrder(orderData) {
  return apiRequest('/orders', {
    method: 'POST',
    body: orderData,
  });
}

export async function updateOrder(id, orderData) {
  return apiRequest(`/orders/${id}`, {
    method: 'PUT',
    body: orderData,
  });
}

export async function deleteOrder(id) {
  return apiRequest(`/orders/${id}`, {
    method: 'DELETE',
  });
}

// Users
export async function getUsers(page = 1, limit = 20, filters = {}) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...filters,
  });
  return apiRequest(`/users?${params}`);
}

export async function getUser(id) {
  return apiRequest(`/users/${id}`);
}

export async function createUser(userData) {
  return apiRequest('/users', {
    method: 'POST',
    body: userData,
  });
}

export async function updateUser(id, userData) {
  return apiRequest(`/users/${id}`, {
    method: 'PUT',
    body: userData,
  });
}

export async function deleteUser(id) {
  return apiRequest(`/users/${id}`, {
    method: 'DELETE',
  });
}

// Analytics
export async function getAnalyticsData() {
  return apiRequest('/analytics/overview');
}

export default {
  login,
  register,
  getMe,
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getAnalyticsData,
};

