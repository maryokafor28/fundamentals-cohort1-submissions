
function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  const dangerousChars = /[';"`\\]/;
  
  const sqlKeywords = /(DROP|DELETE|INSERT|UPDATE|SELECT|UNION|WHERE|FROM|TABLE)/i;
  
  if (dangerousChars.test(email) || sqlKeywords.test(email)) {
    return false;
  }
  
  return emailRegex.test(email);
}


function validatePassword(password) {
  const errors = [];
  
  if (!password || typeof password !== 'string') {
    return { isValid: false, errors: ['Password is required'] };
  }
  
  // Minimum length check
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}


function sanitizeInput(input) {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  let sanitized = input;
  
  sanitized = sanitized.replace(/<[^>]*>/g, '');
  
  sanitized = sanitized.replace(/[<>"`]/g, '');
  
  sanitized = sanitized.replace(/;\s*(DROP|DELETE|INSERT|UPDATE|UNION\s+SELECT)/gi, '');
  
  sanitized = sanitized.replace(/UNION\s+SELECT/gi, '');
  
  sanitized = sanitized.trim();
  
  return sanitized;
}


function validateTaskInput(title, description) {
  const errors = [];
  
  if (!title || typeof title !== 'string' || title.trim() === '') {
    errors.push('Title is required');
  } else {
    if (title.length > 100) {
      errors.push('Title must not exceed 100 characters');
    }
    
    
    if (/<script|javascript:|onerror|onload/i.test(title)) {
      errors.push('Title contains invalid characters');
    }
  }
  
  if (!description || typeof description !== 'string' || description.trim() === '') {
    errors.push('Description is required');
  } else {
    if (description.length > 500) {
      errors.push('Description must not exceed 500 characters');
    }
    
    if (/<script|javascript:|onerror|onload/i.test(description)) {
      errors.push('Description contains invalid characters');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}


function validateObjectId(id) {
  if (!id || typeof id !== 'string') {
    return false;
  }
  
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  return objectIdRegex.test(id);
}

module.exports = {
  validateEmail,
  validatePassword,
  sanitizeInput,
  validateTaskInput,
  validateObjectId
};