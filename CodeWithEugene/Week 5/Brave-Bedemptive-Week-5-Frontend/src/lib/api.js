import axios from 'axios'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken')
      window.location.href = '/login'
    }
    
    // Return formatted error
    const errorMessage = error.response?.data?.message || error.message || 'An error occurred'
    return Promise.reject(new Error(errorMessage))
  }
)

// API endpoints
export const userApi = {
  getAll: (params = {}) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  getStats: (id) => api.get(`/users/${id}/stats`),
}

export const activityApi = {
  getAll: (params = {}) => api.get('/activities', { params }),
  getById: (id) => api.get(`/activities/${id}`),
  create: (data) => api.post('/activities', data),
  update: (id, data) => api.put(`/activities/${id}`, data),
  delete: (id) => api.delete(`/activities/${id}`),
  getUserStats: (userId, params = {}) => api.get(`/activities/user/${userId}/stats`, { params }),
  getTypes: () => api.get('/activities/types'),
}

export const mealApi = {
  getAll: (params = {}) => api.get('/meals', { params }),
  getById: (id) => api.get(`/meals/${id}`),
  create: (data) => api.post('/meals', data),
  update: (id, data) => api.put(`/meals/${id}`, data),
  delete: (id) => api.delete(`/meals/${id}`),
  getUserStats: (userId, params = {}) => api.get(`/meals/user/${userId}/stats`, { params }),
  getDailyNutrition: (userId, date) => api.get(`/meals/user/${userId}/nutrition/${date}`),
  getTypes: () => api.get('/meals/types'),
}

export const doctorApi = {
  getAll: (params = {}) => api.get('/doctors', { params }),
  getById: (id) => api.get(`/doctors/${id}`),
  create: (data) => api.post('/doctors', data),
  update: (id, data) => api.put(`/doctors/${id}`, data),
  delete: (id) => api.delete(`/doctors/${id}`),
  getAvailability: (id) => api.get(`/doctors/${id}/availability`),
  updateAvailability: (id, data) => api.put(`/doctors/${id}/availability`, data),
  searchNearby: (params = {}) => api.get('/doctors/search/nearby', { params }),
  getSpecializations: () => api.get('/doctors/search/specializations'),
  updateRating: (id, data) => api.put(`/doctors/${id}/rating`, data),
}

export const appointmentApi = {
  getAll: (params = {}) => api.get('/appointments', { params }),
  getById: (id) => api.get(`/appointments/${id}`),
  create: (data) => api.post('/appointments', data),
  update: (id, data) => api.put(`/appointments/${id}`, data),
  delete: (id, data) => api.delete(`/appointments/${id}`, { data }),
  updateStatus: (id, data) => api.put(`/appointments/${id}/status`, data),
  getUpcoming: (patientId, params = {}) => api.get(`/appointments/patient/${patientId}/upcoming`, { params }),
  getDoctorSchedule: (doctorId, params = {}) => api.get(`/appointments/doctor/${doctorId}/schedule`, { params }),
  getStats: (userId, params = {}) => api.get(`/appointments/stats/${userId}`, { params }),
}

export const reportApi = {
  getAll: (params = {}) => api.get('/reports', { params }),
  getById: (id) => api.get(`/reports/${id}`),
  create: (data) => api.post('/reports', data),
  update: (id, data) => api.put(`/reports/${id}`, data),
  delete: (id) => api.delete(`/reports/${id}`),
  getUserSummary: (userId, params = {}) => api.get(`/reports/user/${userId}/summary`, { params }),
  review: (id, data) => api.put(`/reports/${id}/review`, data),
  search: (params = {}) => api.get('/reports/search', { params }),
  getTypes: () => api.get('/reports/types'),
}

// General API functions
export const healthCheck = () => api.get('/health')

export default api
