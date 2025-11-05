import { format, isAfter, isBefore, parseISO } from 'date-fns'
import clsx from 'clsx'

// Format date for display
export const formatDate = (date, formatStr = 'MMM dd, yyyy') => {
  if (!date) return 'No date'
  try {
    return format(parseISO(date), formatStr)
  } catch (error) {
    return 'Invalid date'
  }
}

// Format date and time for display
export const formatDateTime = (date) => {
  return formatDate(date, 'MMM dd, yyyy HH:mm')
}

// Check if task is overdue
export const isOverdue = (dueDate, status) => {
  if (!dueDate || status === 'completed') return false
  return isBefore(parseISO(dueDate), new Date())
}

// Check if task is due soon (within 3 days)
export const isDueSoon = (dueDate, status) => {
  if (!dueDate || status === 'completed') return false
  const threeDaysFromNow = new Date()
  threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3)
  return isAfter(parseISO(dueDate), new Date()) && isBefore(parseISO(dueDate), threeDaysFromNow)
}

// Get status color classes
export const getStatusColor = (status) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'in-progress':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'completed':
      return 'bg-green-100 text-green-800 border-green-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

// Get priority color classes
export const getPriorityColor = (priority) => {
  switch (priority) {
    case 'low':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'high':
      return 'bg-red-100 text-red-800 border-red-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

// Get priority icon
export const getPriorityIcon = (priority) => {
  switch (priority) {
    case 'low':
      return '↓'
    case 'medium':
      return '→'
    case 'high':
      return '↑'
    default:
      return '→'
  }
}

// Combine class names
export const cn = (...classes) => {
  return clsx(classes)
}

// Debounce function
export const debounce = (func, wait) => {
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

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate password strength
export const validatePassword = (password) => {
  const errors = []
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }
  
  if (!/[a-zA-Z]/.test(password)) {
    errors.push('Password must contain at least one letter')
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Generate random ID
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9)
}

// Truncate text
export const truncateText = (text, maxLength) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substr(0, maxLength) + '...'
}

// Capitalize first letter
export const capitalize = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// Get initials from name
export const getInitials = (name) => {
  if (!name) return ''
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .substr(0, 2)
}
