// backend/utils/validation.js
// OPTIMIZED: Fast validation with security (no heavy operations)

/**
 * Sanitize string input (FAST version - keeps security)
 */
function sanitizeString(input) {
  if (typeof input !== 'string') return '';
  
  // Quick sanitization - remove dangerous patterns
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
}

/**
 * Validate email format
 */
function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return emailRegex.test(email);
}

/**
 * Validate username (3-30 chars, alphanumeric + underscores)
 */
function isValidUsername(username) {
  if (!username || typeof username !== 'string') return false;
  if (username.length < 3 || username.length > 30) return false;
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  return usernameRegex.test(username);
}

/**
 * Validate password (min 6 chars, must have letters + numbers)
 */
function isValidPassword(password) {
  if (!password || typeof password !== 'string') return false;
  if (password.length < 6) return false;
  if (!/[a-zA-Z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  return true;
}

/**
 * Validate task title (FAST)
 */
function isValidTaskTitle(title) {
  if (!title || typeof title !== 'string') return false;
  const trimmed = title.trim();
  return trimmed.length >= 1 && trimmed.length <= 100;
}

/**
 * Validate task description (FAST)
 */
function isValidTaskDescription(description) {
  if (!description) return true;
  if (typeof description !== 'string') return false;
  return description.trim().length <= 500;
}

/**
 * Validate task status
 */
function isValidTaskStatus(status) {
  const validStatuses = ['pending', 'in-progress', 'completed'];
  return validStatuses.includes(status);
}

/**
 * Validate task priority
 */
function isValidTaskPriority(priority) {
  const validPriorities = ['low', 'medium', 'high'];
  return validPriorities.includes(priority);
}

/**
 * Validate MongoDB ObjectId format
 */
function isValidObjectId(id) {
  if (!id || typeof id !== 'string') return false;
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  return objectIdRegex.test(id);
}

/**
 * Validate and sanitize registration data
 */
function validateRegistration(data) {
  const errors = [];
  
  if (!data.username) {
    errors.push('Username is required');
  } else if (!isValidUsername(data.username)) {
    errors.push('Username must be 3-30 characters and contain only letters, numbers, and underscores');
  }
  
  if (!data.email) {
    errors.push('Email is required');
  } else if (!isValidEmail(data.email)) {
    errors.push('Invalid email format');
  }
  
  if (!data.password) {
    errors.push('Password is required');
  } else if (!isValidPassword(data.password)) {
    errors.push('Password must be at least 6 characters and contain both letters and numbers');
  }
  
  const sanitizedData = {
    username: sanitizeString(data.username),
    email: sanitizeString(data.email.toLowerCase()),
    password: data.password
  };
  
  return { isValid: errors.length === 0, errors, data: sanitizedData };
}

/**
 * Validate and sanitize task creation data (OPTIMIZED - FAST)
 */
function validateTask(data) {
  const errors = [];
  
  if (!data.title) {
    errors.push('Task title is required');
  } else if (!isValidTaskTitle(data.title)) {
    errors.push('Task title must be 1-100 characters');
  }
  
  if (data.description && !isValidTaskDescription(data.description)) {
    errors.push('Task description cannot exceed 500 characters');
  }
  
  if (data.status && !isValidTaskStatus(data.status)) {
    errors.push('Invalid task status. Must be: pending, in-progress, or completed');
  }
  
  if (data.priority && !isValidTaskPriority(data.priority)) {
    errors.push('Invalid task priority. Must be: low, medium, or high');
  }
  
  const sanitizedData = {
    title: sanitizeString(data.title),
    description: data.description ? sanitizeString(data.description) : '',
    status: data.status || 'pending',
    priority: data.priority || 'medium',
    dueDate: data.dueDate || null
  };
  
  return { isValid: errors.length === 0, errors, data: sanitizedData };
}

/**
 * Validate search/filter parameters (OPTIMIZED)
 */
function validateSearchFilter(data) {
  const errors = [];
  const sanitizedData = {};
  
  if (data.search) {
    sanitizedData.search = sanitizeString(data.search);
  }
  
  if (data.status) {
    if (!isValidTaskStatus(data.status)) {
      errors.push('Invalid status filter');
    } else {
      sanitizedData.status = data.status;
    }
  }
  
  if (data.priority) {
    if (!isValidTaskPriority(data.priority)) {
      errors.push('Invalid priority filter');
    } else {
      sanitizedData.priority = data.priority;
    }
  }
  
  if (data.page) {
    const page = parseInt(data.page);
    if (isNaN(page) || page < 1) {
      errors.push('Invalid page number');
    } else {
      sanitizedData.page = page;
    }
  }
  
  if (data.limit) {
    const limit = parseInt(data.limit);
    if (isNaN(limit) || limit < 1 || limit > 100) {
      errors.push('Invalid limit (must be between 1 and 100)');
    } else {
      sanitizedData.limit = limit;
    }
  }
  
  return { isValid: errors.length === 0, errors, data: sanitizedData };
}

module.exports = {
  sanitizeString,
  isValidEmail,
  isValidUsername,
  isValidPassword,
  isValidTaskTitle,
  isValidTaskDescription,
  isValidTaskStatus,
  isValidTaskPriority,
  isValidObjectId,
  validateRegistration,
  validateTask,
  validateSearchFilter
};