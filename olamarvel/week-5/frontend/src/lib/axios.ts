import axios from 'axios';
import Cookies from 'js-cookie';
import { refreshAccessToken } from '@/services/auth';

console.log(process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000')

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000',
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: Array<any> = [];
const processQueue = (error: any | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(instance(addAuthHeader(prom.config, token)));
    }
  });
  failedQueue = [];
};

const addAuthHeader = (config: any, token: string) => {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
    return config;
};

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config; 
    const accessTokenCookieName = "token"; 

  
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/api/auth/refresh') {
      originalRequest._retry = true;

     
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequest });
        });
      }

      isRefreshing = true;

      try {
       
        const newAccessToken = await refreshAccessToken();
        
        if (newAccessToken) {
         
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          processQueue(null, newAccessToken); 
          return instance(originalRequest); 
        } else {
          
          processQueue(new Error('Refresh token invalid or expired'), null); 
          Cookies.remove(accessTokenCookieName); 
          window.location.href = '/login'; 
          return Promise.reject(new Error('Session expired. Please log in again.')); 
        }
      } catch (refreshError: any) {
       
        processQueue(refreshError, null);
        Cookies.remove(accessTokenCookieName); 
        window.location.href = '/login'; 
        return Promise.reject(refreshError); 
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error); 
  }
);

export default instance;
