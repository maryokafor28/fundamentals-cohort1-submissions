import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

// Simple response wrapper to return data or throw a normalized error
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response) {
      const normalized = new Error(err.response.data?.message || 'API error')
      normalized.status = err.response.status
      normalized.data = err.response.data
      return Promise.reject(normalized)
    }
    return Promise.reject(err)
  }
)

export default api
