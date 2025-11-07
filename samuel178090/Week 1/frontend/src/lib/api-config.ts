// src/lib/api-config.ts
export const API_CONFIG = {
  baseURL: `${process.env.NEXT_PUBLIC_BASE_API_URL}${process.env.NEXT_PUBLIC_BASE_API_PREFIX}`,
  timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '15000'),
};

// Export commonly used endpoints
export const API_ENDPOINTS = {
  auth: {
    login: `${API_CONFIG.baseURL}/users/login`,
    register: `${API_CONFIG.baseURL}/users`,
    logout: `${API_CONFIG.baseURL}/users/logout`,
    verifyEmail: (otp: string, email: string) => 
      `${API_CONFIG.baseURL}/users/verify-email/${otp}/${email}`,
  },
  products: {
    list: `${API_CONFIG.baseURL}/products`,
    detail: (id: string) => `${API_CONFIG.baseURL}/products/${id}`,
  },
  csrf: `${process.env.NEXT_PUBLIC_BASE_API_URL}/csrf-token`,
};