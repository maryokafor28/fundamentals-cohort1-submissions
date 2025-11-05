import axios from 'axios';
import { Cart, ApiResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const cartService = {
  // Get user's cart
  async getCart(userId: string): Promise<Cart> {
    try {
      const response = await api.get<ApiResponse<Cart>>(`/get-cart/${userId}`);

      if (response.data.success && response.data.data) {
        return response.data.data;
      } else {
        // Return empty cart if no cart found
        return {
          _id: '',
          userId,
          items: [],
          totalPrice: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        };
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      // Return empty cart on error
      return {
        _id: '',
        userId,
        items: [],
        totalPrice: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }
  },

  // Add item to cart
  async addToCart(userId: string, productId: string, quantity: number = 1): Promise<Cart> {
    try {
      const response = await api.post<ApiResponse<Cart>>('/add-to-cart', {
        userId,
        productId,
        quantity
      });

      if (response.data.success && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to add item to cart');
      }
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      throw new Error(error.response?.data?.message || 'Failed to add item to cart');
    }
  },

  // Update cart item quantity
  async updateCartItem(userId: string, itemId: string, quantity: number): Promise<Cart> {
    try {
      const response = await api.put<ApiResponse<Cart>>('/update-cart-item', {
        userId,
        itemId,
        quantity
      });

      if (response.data.success && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to update cart item');
      }
    } catch (error: any) {
      console.error('Error updating cart item:', error);
      throw new Error(error.response?.data?.message || 'Failed to update cart item');
    }
  },

  // Remove item from cart
  async removeFromCart(userId: string, itemId: string): Promise<Cart> {
    try {
      const response = await api.delete<ApiResponse<Cart>>(`/remove-from-cart`, {
        data: { userId, itemId }
      });

      if (response.data.success && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to remove item from cart');
      }
    } catch (error: any) {
      console.error('Error removing from cart:', error);
      throw new Error(error.response?.data?.message || 'Failed to remove item from cart');
    }
  },

  // Clear entire cart
  async clearCart(userId: string): Promise<void> {
    try {
      const response = await api.delete<ApiResponse<null>>(`/clear-cart/${userId}`);

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to clear cart');
      }
    } catch (error: any) {
      console.error('Error clearing cart:', error);
      throw new Error(error.response?.data?.message || 'Failed to clear cart');
    }
  }
};

// Health check function to test API connection
export const healthCheck = async (): Promise<boolean> => {
  try {
    const response = await api.get('/health');
    return response.status === 200;
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
};
