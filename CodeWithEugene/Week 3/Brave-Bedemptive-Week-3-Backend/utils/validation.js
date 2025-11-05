/**
 * Manual input validation and sanitization utilities
 * Prevents injection attacks and ensures data integrity
 */

/**
 * Sanitize string input to prevent XSS and injection attacks
 * @param {string} input - Input string to sanitize
 * @param {number} maxLength - Maximum allowed length
 * @returns {string} Sanitized string
 */
const sanitizeString = (input, maxLength = 1000) => {
  if (typeof input !== 'string') {
    throw new Error('Input must be a string');
  }
  
  // Remove null bytes and control characters
  let sanitized = input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  
  // Trim whitespace
  sanitized = sanitized.trim();
  
  // Check length
  if (sanitized.length > maxLength) {
    throw new Error(`Input exceeds maximum length of ${maxLength} characters`);
  }
  
  // Escape HTML entities to prevent XSS
  sanitized = sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
  
  return sanitized;
};

/**
 * Validate and sanitize email address
 * @param {string} email - Email to validate
 * @returns {string} Sanitized email
 */
const validateEmail = (email) => {
  if (typeof email !== 'string') {
    throw new Error('Email must be a string');
  }
  
  const sanitized = sanitizeString(email.toLowerCase(), 254);
  
  // Email regex pattern
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  if (!emailRegex.test(sanitized)) {
    throw new Error('Invalid email format');
  }
  
  return sanitized;
};

/**
 * Validate and sanitize username
 * @param {string} username - Username to validate
 * @returns {string} Sanitized username
 */
const validateUsername = (username) => {
  if (typeof username !== 'string') {
    throw new Error('Username must be a string');
  }
  
  const sanitized = sanitizeString(username, 30);
  
  // Username regex: alphanumeric and underscores only
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  
  if (!usernameRegex.test(sanitized)) {
    throw new Error('Username can only contain letters, numbers, and underscores');
  }
  
  if (sanitized.length < 3) {
    throw new Error('Username must be at least 3 characters long');
  }
  
  return sanitized;
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {string} Validated password
 */
const validatePassword = (password) => {
  if (typeof password !== 'string') {
    throw new Error('Password must be a string');
  }
  
  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters long');
  }
  
  if (password.length > 128) {
    throw new Error('Password cannot exceed 128 characters');
  }
  
  // Check for common weak passwords
  const weakPasswords = [
    'password', '123456', '123456789', 'qwerty', 'abc123',
    'password123', 'admin', 'letmein', 'welcome', 'monkey'
  ];
  
  if (weakPasswords.includes(password.toLowerCase())) {
    throw new Error('Password is too common, please choose a stronger password');
  }
  
  // Check for at least one letter and one number
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  
  if (!hasLetter || !hasNumber) {
    throw new Error('Password must contain at least one letter and one number');
  }
  
  return password;
};

/**
 * Validate MongoDB ObjectId
 * @param {string} id - ObjectId to validate
 * @returns {string} Validated ObjectId
 */
const validateObjectId = (id) => {
  if (typeof id !== 'string') {
    throw new Error('ID must be a string');
  }
  
  const sanitized = sanitizeString(id, 24);
  
  // MongoDB ObjectId regex
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  
  if (!objectIdRegex.test(sanitized)) {
    throw new Error('Invalid ID format');
  }
  
  return sanitized;
};

/**
 * Validate and sanitize task title
 * @param {string} title - Task title to validate
 * @returns {string} Sanitized title
 */
const validateTaskTitle = (title) => {
  if (typeof title !== 'string') {
    throw new Error('Task title must be a string');
  }
  
  const sanitized = sanitizeString(title, 200);
  
  if (sanitized.length === 0) {
    throw new Error('Task title cannot be empty');
  }
  
  return sanitized;
};

/**
 * Validate and sanitize task description
 * @param {string} description - Task description to validate
 * @returns {string} Sanitized description
 */
const validateTaskDescription = (description) => {
  if (typeof description !== 'string') {
    return '';
  }
  
  return sanitizeString(description, 1000);
};

/**
 * Validate task status
 * @param {string} status - Status to validate
 * @returns {string} Validated status
 */
const validateTaskStatus = (status) => {
  const validStatuses = ['pending', 'in-progress', 'completed'];
  
  if (!validStatuses.includes(status)) {
    throw new Error(`Status must be one of: ${validStatuses.join(', ')}`);
  }
  
  return status;
};

/**
 * Validate task priority
 * @param {string} priority - Priority to validate
 * @returns {string} Validated priority
 */
const validateTaskPriority = (priority) => {
  const validPriorities = ['low', 'medium', 'high'];
  
  if (!validPriorities.includes(priority)) {
    throw new Error(`Priority must be one of: ${validPriorities.join(', ')}`);
  }
  
  return priority;
};

/**
 * Validate date string
 * @param {string} dateString - Date string to validate
 * @returns {Date} Validated date
 */
const validateDate = (dateString) => {
  if (!dateString) {
    return null;
  }
  
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date format');
  }
  
  return date;
};

/**
 * Validate and sanitize tags array
 * @param {Array} tags - Tags array to validate
 * @returns {Array} Sanitized tags array
 */
const validateTags = (tags) => {
  if (!Array.isArray(tags)) {
    return [];
  }
  
  const sanitizedTags = tags
    .filter(tag => typeof tag === 'string')
    .map(tag => sanitizeString(tag, 20))
    .filter(tag => tag.length > 0)
    .slice(0, 10); // Limit to 10 tags
  
  // Remove duplicates
  return [...new Set(sanitizedTags)];
};

/**
 * Validate pagination parameters
 * @param {Object} params - Pagination parameters
 * @returns {Object} Validated pagination parameters
 */
const validatePagination = (params) => {
  const page = parseInt(params.page) || 1;
  const limit = parseInt(params.limit) || 10;
  
  if (page < 1) {
    throw new Error('Page must be greater than 0');
  }
  
  if (limit < 1 || limit > 100) {
    throw new Error('Limit must be between 1 and 100');
  }
  
  return { page, limit };
};

/**
 * Validate sort parameters
 * @param {Object} params - Sort parameters
 * @returns {Object} Validated sort parameters
 */
const validateSort = (params) => {
  const validSortFields = ['createdAt', 'updatedAt', 'title', 'status', 'priority', 'dueDate'];
  const sortBy = params.sortBy || 'createdAt';
  const sortOrder = params.sortOrder || 'desc';
  
  if (!validSortFields.includes(sortBy)) {
    throw new Error(`Sort field must be one of: ${validSortFields.join(', ')}`);
  }
  
  if (!['asc', 'desc'].includes(sortOrder)) {
    throw new Error('Sort order must be either "asc" or "desc"');
  }
  
  return { sortBy, sortOrder };
};

/**
 * Validate search query
 * @param {string} query - Search query to validate
 * @returns {string} Sanitized search query
 */
const validateSearchQuery = (query) => {
  if (!query || typeof query !== 'string') {
    return '';
  }
  
  return sanitizeString(query, 100);
};

module.exports = {
  sanitizeString,
  validateEmail,
  validateUsername,
  validatePassword,
  validateObjectId,
  validateTaskTitle,
  validateTaskDescription,
  validateTaskStatus,
  validateTaskPriority,
  validateDate,
  validateTags,
  validatePagination,
  validateSort,
  validateSearchQuery
};
