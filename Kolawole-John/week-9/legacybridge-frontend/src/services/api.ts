import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';

/**
 * API Service
 * 
 * Centralized Axios configuration with:
 * - Base URL configuration
 * - Request/response interceptors
 * - Error handling
 * - Request/response logging
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth, logging, etc.
apiClient.interceptors.request.use(
  (config) => {
    // Log request in development
    if (import.meta.env.DEV) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
        params: config.params,
        data: config.data,
      });
    }

    // Add timestamp to prevent caching issues
    if (config.params) {
      config.params._t = Date.now();
    }

    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.log(`[API Response] ${response.config.url}`, {
        status: response.status,
        cached: response.data?.metadata?.cached,
        data: response.data,
      });
    }

    return response;
  },
  (error: AxiosError) => {
    // Handle different error types
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const data: any = error.response.data;

      console.error('[API Error Response]', {
        status,
        message: data?.error?.message || error.message,
        code: data?.error?.code,
      });

      // You can handle specific status codes here
      switch (status) {
        case 401:
          // Handle unauthorized (e.g., redirect to login)
          console.error('Unauthorized access');
          break;
        case 403:
          console.error('Forbidden access');
          break;
        case 404:
          console.error('Resource not found');
          break;
        case 429:
          console.error('Too many requests - rate limited');
          break;
        case 503:
          console.error('Service unavailable');
          break;
      }
    } else if (error.request) {
      // Request made but no response
      console.error('[API No Response]', error.message);
    } else {
      // Request setup error
      console.error('[API Setup Error]', error.message);
    }

    return Promise.reject(error);
  }
);

/**
 * Format error message for display
 */
export const getErrorMessage = (error: any): string => {
  if (error.response?.data?.error?.message) {
    return error.response.data.error.message;
  }
  
  if (error.message) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
};

/**
 * Check if error is from API
 */
export const isApiError = (error: any): boolean => {
  return error.response?.data?.error !== undefined;
};

/**
 * Get error code
 */
export const getErrorCode = (error: any): string | null => {
  return error.response?.data?.error?.code || null;
};

export default apiClient;