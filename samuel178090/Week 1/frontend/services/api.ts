import axios, { AxiosResponse, AxiosRequestConfig, AxiosError } from 'axios';

// Interface for API response data
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  result: T;
}

// Interface for error response
export interface ApiError {
  success: false;
  message: string;
  errorCode?: string;
  details?: any;
}

// Base URL (NestJS backend)
const baseURL = `${process.env.NEXT_PUBLIC_BASE_API_URL_LOCAL || 'http://localhost:3100'}${process.env.NEXT_PUBLIC_BASE_API_PREFIX || '/api/v1'}`;

// Backend base URL for images (without /api/v1)
export const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL_LOCAL || 'http://localhost:3100';

// Create axios instance
const apiClient = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // important for cookies + CSRF
});

// ✅ Function to fetch CSRF token from backend
async function getCsrfToken(): Promise<string> {
  const backendUrl = process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:3100';
  const res = await axios.get<{ token: string }>(`${backendUrl}/csrf-token`, {
    withCredentials: true,
  });
  return res.data.token;
}

// Request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    // Add auth token if available
    if (typeof window !== 'undefined') {
      const authToken = localStorage.getItem('_digi_auth_token');
      if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
      }
    }

    // Always attach CSRF token
    const csrfToken = await getCsrfToken();
    config.headers['X-CSRF-TOKEN'] = csrfToken;

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('_digi_auth_token');
        localStorage.removeItem('_digi_user');
        if (window.location.pathname !== '/auth') {
          window.location.href = '/auth';
        }
      }
    }
    return Promise.reject(error);
  }
);

const responseBody = <T>(response: AxiosResponse<T>): T => response.data;

const requests = {
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.get<T>(url, config).then(responseBody),

  post: <T = any>(url: string, body?: any, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.post<T>(url, body, config).then(responseBody),

  put: <T = any>(url: string, body?: any, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.put<T>(url, body, config).then(responseBody),

  patch: <T = any>(url: string, body?: any, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.patch<T>(url, body, config).then(responseBody),

  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.delete<T>(url, config).then(responseBody),
};

// Export both the requests object and the axios instance
export { apiClient };
export default requests;
