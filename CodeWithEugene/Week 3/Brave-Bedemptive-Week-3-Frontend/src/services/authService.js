import api, { setAccessToken, clearAccessToken } from './api'

export const authService = {
  // Register a new user
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData)
      const { accessToken, user } = response.data
      
      // Store access token in memory
      setAccessToken(accessToken)
      
      return { user, accessToken }
    } catch (error) {
      throw error
    }
  },

  // Login user
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials)
      const { accessToken, user } = response.data
      
      // Store access token in memory
      setAccessToken(accessToken)
      
      return { user, accessToken }
    } catch (error) {
      throw error
    }
  },

  // Logout user
  async logout() {
    try {
      await api.post('/auth/logout')
    } catch (error) {
      // Even if logout fails on server, clear local token
      console.error('Logout error:', error)
    } finally {
      // Always clear the token from memory
      clearAccessToken()
    }
  },

  // Logout from all devices
  async logoutAll() {
    try {
      await api.post('/auth/logout-all')
    } catch (error) {
      console.error('Logout all error:', error)
    } finally {
      clearAccessToken()
    }
  },

  // Get current user profile
  async getCurrentUser() {
    try {
      const response = await api.get('/auth/me')
      return response.data.user
    } catch (error) {
      throw error
    }
  },

  // Update user profile
  async updateProfile(profileData) {
    try {
      const response = await api.put('/auth/profile', profileData)
      return response.data.user
    } catch (error) {
      throw error
    }
  },

  // Refresh access token (handled automatically by interceptor)
  async refreshToken() {
    try {
      const response = await api.post('/auth/refresh')
      const { accessToken } = response.data
      setAccessToken(accessToken)
      return accessToken
    } catch (error) {
      clearAccessToken()
      throw error
    }
  }
}
