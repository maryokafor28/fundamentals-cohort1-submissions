import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { authService } from '../services/authService'
import toast from 'react-hot-toast'

// Initial state
const initialState = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
}

// Action types
const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  UPDATE_USER: 'UPDATE_USER',
  AUTH_ERROR: 'AUTH_ERROR',
}

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      }
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      }
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      }
    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      }
    case AUTH_ACTIONS.AUTH_ERROR:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      }
    default:
      return state
  }
}

// Create context
const AuthContext = createContext()

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true })
        
        // Try to get current user
        const user = await authService.getCurrentUser()
        dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: user })
      } catch (error) {
        // User is not authenticated
        dispatch({ type: AUTH_ACTIONS.AUTH_ERROR })
      }
    }

    checkAuth()
  }, [])

  // Login function
  const login = async (credentials) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true })
      
      const { user } = await authService.login(credentials)
      dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: user })
      
      toast.success('Login successful!')
      return { success: true }
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.AUTH_ERROR })
      const errorMessage = error.response?.data?.error || 'Login failed'
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  // Register function
  const register = async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true })
      
      const { user } = await authService.register(userData)
      dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: user })
      
      toast.success('Registration successful!')
      return { success: true }
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.AUTH_ERROR })
      const errorMessage = error.response?.data?.error || 'Registration failed'
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  // Logout function
  const logout = async () => {
    try {
      await authService.logout()
      dispatch({ type: AUTH_ACTIONS.LOGOUT })
      toast.success('Logged out successfully')
    } catch (error) {
      // Even if logout fails, clear local state
      dispatch({ type: AUTH_ACTIONS.LOGOUT })
      console.error('Logout error:', error)
    }
  }

  // Logout from all devices
  const logoutAll = async () => {
    try {
      await authService.logoutAll()
      dispatch({ type: AUTH_ACTIONS.LOGOUT })
      toast.success('Logged out from all devices')
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.LOGOUT })
      console.error('Logout all error:', error)
    }
  }

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      const updatedUser = await authService.updateProfile(profileData)
      dispatch({ type: AUTH_ACTIONS.UPDATE_USER, payload: updatedUser })
      toast.success('Profile updated successfully')
      return { success: true }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Profile update failed'
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  // Check if user has specific role
  const hasRole = (role) => {
    return state.user?.role === role
  }

  // Check if user is admin
  const isAdmin = () => {
    return state.user?.role === 'admin'
  }

  const value = {
    ...state,
    login,
    register,
    logout,
    logoutAll,
    updateProfile,
    hasRole,
    isAdmin,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
