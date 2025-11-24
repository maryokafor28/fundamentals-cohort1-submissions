import axios from 'axios';

// ============================================================
// API CONFIGURATION
// ============================================================
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const TIMEOUT = 10000;
const MAX_RETRIES = 3;

// ============================================================
// AXIOS INSTANCE
// ============================================================
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// ============================================================
// REQUEST INTERCEPTOR
// ============================================================
apiClient.interceptors.request.use(
  (config) => {
    // Add timestamp to prevent caching
    config.params = {
      ...config.params,
      _t: Date.now(),
    };

    console.log(`📤 ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request setup error:', error.message);
    return Promise.reject(error);
  }
);

// ============================================================
// RESPONSE INTERCEPTOR
// ============================================================
apiClient.interceptors.response.use(
  (response) => {
    console.log(`📥 ${response.status} ${response.config.url}`);
    return response;
  },
  async (error) => {
    const { config, response } = error;

    // Log error details
    if (response) {
      console.error(`❌ Response error: ${response.status} ${response.statusText}`);
    } else if (error.request) {
      console.error('❌ Network error: No response received');
    } else {
      console.error('❌ Request error:', error.message);
    }

    // Retry logic for network errors
    if (!response && config && !config.__retryCount) {
      config.__retryCount = config.__retryCount || 0;
      
      if (config.__retryCount < MAX_RETRIES) {
        config.__retryCount += 1;
        console.log(`🔄 Retry attempt ${config.__retryCount}/${MAX_RETRIES}`);
        
        // Exponential backoff
        const delay = Math.pow(2, config.__retryCount) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        
        return apiClient(config);
      }
    }

    return Promise.reject(error);
  }
);

// ============================================================
// ERROR HANDLER
// ============================================================
const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    return {
      message: error.response.data?.error?.message || error.response.statusText,
      status: error.response.status,
      data: error.response.data,
    };
  } else if (error.request) {
    // Request made but no response
    return {
      message: 'Unable to connect to server. Please check if the backend is running.',
      status: 0,
      data: null,
    };
  } else {
    // Something else happened
    return {
      message: error.message || 'An unexpected error occurred',
      status: -1,
      data: null,
    };
  }
};

// ============================================================
// API METHODS
// ============================================================

/**
 * Get system health
 */
export const getHealth = async () => {
  try {
    const response = await apiClient.get('/health');
    return { success: true, data: response.data, error: null };
  } catch (error) {
    const errorInfo = handleApiError(error);
    return { success: false, data: null, error: errorInfo };
  }
};

/**
 * Get service status
 */
export const getStatus = async () => {
  try {
    const response = await apiClient.get('/status');
    return { success: true, data: response.data, error: null };
  } catch (error) {
    const errorInfo = handleApiError(error);
    return { success: false, data: null, error: errorInfo };
  }
};

/**
 * Get service info
 */
export const getInfo = async () => {
  try {
    const response = await apiClient.get('/info');
    return { success: true, data: response.data, error: null };
  } catch (error) {
    const errorInfo = handleApiError(error);
    return { success: false, data: null, error: errorInfo };
  }
};

/**
 * Get Prometheus metrics
 */
export const getMetrics = async () => {
  try {
    const response = await apiClient.get('/metrics', {
      headers: { Accept: 'text/plain' },
    });
    return { success: true, data: response.data, error: null };
  } catch (error) {
    const errorInfo = handleApiError(error);
    return { success: false, data: null, error: errorInfo };
  }
};

/**
 * Fetch all dashboard data in parallel
 */
export const fetchDashboardData = async () => {
  try {
    const [healthResult, statusResult, infoResult] = await Promise.allSettled([
      getHealth(),
      getStatus(),
      getInfo(),
    ]);

    return {
      health: healthResult.status === 'fulfilled' ? healthResult.value.data : null,
      status: statusResult.status === 'fulfilled' ? statusResult.value.data?.data : null,
      info: infoResult.status === 'fulfilled' ? infoResult.value.data?.data : null,
      error: healthResult.status === 'rejected' ? healthResult.reason : null,
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};

export default apiClient;