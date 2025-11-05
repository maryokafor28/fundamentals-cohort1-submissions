import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, parseISO, formatDistanceToNow } from 'date-fns'

// Utility function to merge Tailwind classes
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Date formatting utilities
export function formatDate(date, formatStr = 'MMM dd, yyyy') {
  if (!date) return ''
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, formatStr)
}

export function formatDateTime(date, formatStr = 'MMM dd, yyyy HH:mm') {
  if (!date) return ''
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, formatStr)
}

export function formatTimeAgo(date) {
  if (!date) return ''
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return formatDistanceToNow(dateObj, { addSuffix: true })
}

// Number formatting utilities
export function formatNumber(number, options = {}) {
  return new Intl.NumberFormat('en-US', options).format(number)
}

export function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

export function formatPercentage(value, decimals = 1) {
  return `${(value * 100).toFixed(decimals)}%`
}

// Health utility functions
export function calculateBMI(weight, height) {
  if (!weight || !height) return null
  const heightInMeters = height / 100
  return (weight / (heightInMeters * heightInMeters)).toFixed(1)
}

export function getBMICategory(bmi) {
  if (!bmi) return 'Unknown'
  if (bmi < 18.5) return 'Underweight'
  if (bmi < 25) return 'Normal weight'
  if (bmi < 30) return 'Overweight'
  return 'Obese'
}

export function getBMIColor(bmi) {
  if (!bmi) return 'neutral'
  if (bmi < 18.5) return 'accent'
  if (bmi < 25) return 'secondary'
  if (bmi < 30) return 'warning'
  return 'accent'
}

export function calculateAge(dateOfBirth) {
  if (!dateOfBirth) return null
  const today = new Date()
  const birthDate = new Date(dateOfBirth)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

// Status utility functions
export function getStatusColor(status) {
  const statusColors = {
    // Appointment statuses
    scheduled: 'blue',
    confirmed: 'green',
    in_progress: 'yellow',
    completed: 'gray',
    cancelled: 'red',
    no_show: 'orange',
    rescheduled: 'purple',
    
    // Report statuses
    draft: 'gray',
    pending_review: 'yellow',
    reviewed: 'blue',
    final: 'green',
    amended: 'purple',
    
    // General statuses
    active: 'green',
    inactive: 'gray',
    pending: 'yellow',
    approved: 'green',
    rejected: 'red',
    normal: 'green',
    abnormal: 'red',
    critical: 'red',
    
    // Priority levels
    low: 'gray',
    normal: 'blue',
    high: 'orange',
    urgent: 'red',
  }
  
  return statusColors[status] || 'gray'
}

export function getStatusBadgeClass(status) {
  const color = getStatusColor(status)
  const colorClasses = {
    gray: 'bg-gray-100 text-gray-800',
    red: 'bg-red-100 text-red-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    green: 'bg-green-100 text-green-800',
    blue: 'bg-blue-100 text-blue-800',
    orange: 'bg-orange-100 text-orange-800',
    purple: 'bg-purple-100 text-purple-800',
  }
  
  return colorClasses[color] || colorClasses.gray
}

// Activity utility functions
export function getActivityIcon(type) {
  const icons = {
    running: '🏃',
    walking: '🚶',
    cycling: '🚴',
    swimming: '🏊',
    weightlifting: '🏋️',
    yoga: '🧘',
    pilates: '🤸',
    basketball: '🏀',
    football: '⚽',
    tennis: '🎾',
    hiking: '🥾',
    dancing: '💃',
    boxing: '🥊',
    crossfit: '💪',
    rowing: '🚣',
    climbing: '🧗',
    skiing: '⛷️',
    golf: '⛳',
    volleyball: '🏐',
    badminton: '🏸',
    other: '🏃',
  }
  
  return icons[type] || icons.other
}

export function getIntensityColor(intensity) {
  const intensityColors = {
    low: 'green',
    moderate: 'yellow',
    high: 'orange',
    very_high: 'red',
  }
  
  return intensityColors[intensity] || 'gray'
}

// Form validation utilities
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePhone(phone) {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

// Array utilities
export function groupBy(array, key) {
  return array.reduce((groups, item) => {
    const group = item[key]
    groups[group] = groups[group] || []
    groups[group].push(item)
    return groups
  }, {})
}

export function sortBy(array, key, direction = 'asc') {
  return [...array].sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]
    
    if (direction === 'desc') {
      return bVal > aVal ? 1 : -1
    }
    return aVal > bVal ? 1 : -1
  })
}

// Debounce utility
export function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Local storage utilities
export function getFromStorage(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error('Error reading from localStorage:', error)
    return defaultValue
  }
}

export function setToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('Error writing to localStorage:', error)
  }
}

export function removeFromStorage(key) {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error('Error removing from localStorage:', error)
  }
}

// File utilities
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Error handling utilities
export function getErrorMessage(error) {
  if (typeof error === 'string') return error
  if (error?.message) return error.message
  if (error?.response?.data?.message) return error.response.data.message
  return 'An unexpected error occurred'
}

// URL utilities
export function buildQueryString(params) {
  const searchParams = new URLSearchParams()
  
  Object.keys(params).forEach(key => {
    const value = params[key]
    if (value !== null && value !== undefined && value !== '') {
      searchParams.append(key, value)
    }
  })
  
  return searchParams.toString()
}
