import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Sending request with token:', token.substring(0, 20) + '...');
    } else {
      console.log('No token found in localStorage');
    }
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data);
    if (error.response?.status === 401) {
      console.error('401 Error details:', {
        url: error.config?.url,
        headers: error.config?.headers,
        token: error.config?.headers?.Authorization
      });
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export interface User {
  id: string;
  _id?: string;
  username: string;
  email: string;
  role: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  inStock: boolean;
  stockQuantity: number;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (username: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { username, email, password });
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Cart API
export const cartAPI = {
  addToCart: async (productId: string, quantity: number = 1) => {
    const response = await api.post('/add-to-cart', { productId, quantity });
    return response.data;
  },

  getCart: async (userId: string) => {
    const response = await api.get(`/get-cart/${userId}`);
    return response.data;
  },

  updateCartItem: async (userId: string, productId: string, quantity: number) => {
    const response = await api.put(`/cart/${userId}/items/${productId}`, { quantity });
    return response.data;
  },

  removeFromCart: async (userId: string, productId: string) => {
    const response = await api.delete(`/cart/${userId}/items/${productId}`);
    return response.data;
  },

  clearCart: async (userId: string) => {
    const response = await api.delete(`/cart/${userId}/clear`);
    return response.data;
  },
};

// Mock products for demo
export const mockProducts: Product[] = [
  {
    _id: '507f1f77bcf86cd799439011',
    name: 'Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    price: 89.99,
    category: 'electronics',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
    inStock: true,
    stockQuantity: 15,
  },
  {
    _id: '507f1f77bcf86cd799439012',
    name: 'Smart Watch',
    description: 'Feature-rich smartwatch with health tracking',
    price: 199.99,
    category: 'electronics',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
    inStock: true,
    stockQuantity: 8,
  },
  {
    _id: '507f1f77bcf86cd799439013',
    name: 'Portable Speaker',
    description: 'Compact Bluetooth speaker with amazing sound quality',
    price: 49.99,
    category: 'electronics',
    imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop',
    inStock: true,
    stockQuantity: 25,
  },
  {
    _id: '507f1f77bcf86cd799439014',
    name: 'USB-C Cable',
    description: 'Durable USB-C charging cable - 2 meters',
    price: 12.99,
    category: 'accessories',
    imageUrl: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=300&h=300&fit=crop',
    inStock: true,
    stockQuantity: 50,
  },
  {
    _id: '507f1f77bcf86cd799439015',
    name: 'Phone Case',
    description: 'Protective phone case with premium materials',
    price: 24.99,
    category: 'accessories',
    imageUrl: 'https://images.unsplash.com/photo-1601593346740-925612772716?w=300&h=300&fit=crop',
    inStock: true,
    stockQuantity: 30,
  },
  {
    _id: '507f1f77bcf86cd799439016',
    name: 'Laptop Stand',
    description: 'Adjustable aluminum laptop stand for better ergonomics',
    price: 39.99,
    category: 'accessories',
    imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop',
    inStock: true,
    stockQuantity: 20,
  },
];

export default api;
