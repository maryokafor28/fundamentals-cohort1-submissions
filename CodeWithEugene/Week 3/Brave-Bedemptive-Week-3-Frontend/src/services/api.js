import axios from 'axios'
import toast from 'react-hot-toast'

// Create axios instance
const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // Important for cookies
  headers: {
    'Content-Type': 'application/json',
  },
})

// Token storage in memory (secure approach)
let accessToken = null

// Function to set access token in memory
export const setAccessToken = (token) => {
  accessToken = token
}

// Function to get access token from memory
export const getAccessToken = () => {
  return accessToken
}

// Function to clear access token from memory
export const clearAccessToken = () => {
  accessToken = null
}

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // If error is 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Try to refresh the token
        const response = await axios.post('/api/auth/refresh', {}, {
          withCredentials: true,
        })

        const { accessToken: newAccessToken } = response.data
        
        // Update the token in memory
        setAccessToken(newAccessToken)

        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return api(originalRequest)
      } catch (refreshError) {
        // Refresh failed, redirect to login
        clearAccessToken()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    // Handle other errors
    if (error.response?.data?.error) {
      toast.error(error.response.data.error)
    } else if (error.message) {
      toast.error(error.message)
    }

    return Promise.reject(error)
  }
)

export default api
