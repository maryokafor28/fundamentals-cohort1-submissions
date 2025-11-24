/**
 * Application constants
 */

export const APP_NAME = 'LegacyBridge';
export const APP_VERSION = '2.0.0';

// API Configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

// Payment Statuses
export const PAYMENT_STATUSES = {
  COMPLETED: 'completed',
  PENDING: 'pending',
  FAILED: 'failed',
} as const;

export const PAYMENT_STATUS_LABELS = {
  completed: 'Completed',
  pending: 'Pending',
  failed: 'Failed',
};

export const PAYMENT_STATUS_COLORS = {
  completed: 'success',
  pending: 'warning',
  failed: 'danger',
};

// Routes
export const ROUTES = {
  HOME: '/',
  PAYMENTS: '/payments',
  PAYMENT_DETAIL: '/payments/:id',
  CUSTOMERS: '/customers',
  CUSTOMER_DETAIL: '/customers/:id',
};

// Query Keys (for React Query)
export const QUERY_KEYS = {
  PAYMENTS: 'payments',
  PAYMENT: 'payment',
  PAYMENT_STATS: 'payment-stats',
  CUSTOMERS: 'customers',
  CUSTOMER: 'customer',
  HEALTH: 'health',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  THEME: 'legacybridge-theme',
  PAGE_SIZE: 'legacybridge-page-size',
};

// Debounce Delays (ms)
export const DEBOUNCE_DELAY = 500;
export const SEARCH_DEBOUNCE = 300;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK: 'Network error. Please check your connection.',
  SERVER: 'Server error. Please try again later.',
  NOT_FOUND: 'Resource not found.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  VALIDATION: 'Please check your input and try again.',
  UNKNOWN: 'An unexpected error occurred.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  PAYMENT_LOADED: 'Payment loaded successfully',
  CUSTOMER_LOADED: 'Customer loaded successfully',
  DATA_REFRESHED: 'Data refreshed successfully',
};