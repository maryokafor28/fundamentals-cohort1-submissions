const {
  validateEmail,
  validatePassword,
  sanitizeInput,
  validateTaskInput
} = require('../utils/validators');

describe('Email Validation', () => {
  test('should accept valid email addresses', () => {
    expect(validateEmail('user@example.com')).toBe(true);
    expect(validateEmail('test.user@domain.co.uk')).toBe(true);
    expect(validateEmail('name+tag@company.com')).toBe(true);
  });

  test('should reject invalid email addresses', () => {
    expect(validateEmail('invalid')).toBe(false);
    expect(validateEmail('user@')).toBe(false);
    expect(validateEmail('@domain.com')).toBe(false);
    expect(validateEmail('user @domain.com')).toBe(false);
    expect(validateEmail('')).toBe(false);
    expect(validateEmail(null)).toBe(false);
  });

  test('should reject emails with SQL injection attempts', () => {
    expect(validateEmail("admin'--@example.com")).toBe(false);
    expect(validateEmail('user@domain.com; DROP TABLE users;')).toBe(false);
  });
});

describe('Password Validation', () => {
  test('should accept strong passwords', () => {
    const result = validatePassword('SecurePass123!');
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('should reject passwords shorter than 8 characters', () => {
    const result = validatePassword('Short1!');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must be at least 8 characters long');
  });

  test('should reject passwords without uppercase letters', () => {
    const result = validatePassword('password123!');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must contain at least one uppercase letter');
  });

  test('should reject passwords without lowercase letters', () => {
    const result = validatePassword('PASSWORD123!');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must contain at least one lowercase letter');
  });

  test('should reject passwords without numbers', () => {
    const result = validatePassword('SecurePass!');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must contain at least one number');
  });

  test('should reject passwords without special characters', () => {
    const result = validatePassword('SecurePass123');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must contain at least one special character');
  });

  test('should reject empty or null passwords', () => {
    expect(validatePassword('').isValid).toBe(false);
    expect(validatePassword(null).isValid).toBe(false);
  });
});

describe('Input Sanitization', () => {
  test('should remove HTML tags', () => {
    expect(sanitizeInput('<script>alert("xss")</script>')).toBe('alert(xss)');
    expect(sanitizeInput('<b>Bold Text</b>')).toBe('Bold Text');
    expect(sanitizeInput('Normal<div>Text</div>Here')).toBe('NormalTextHere');
  });

  test('should remove dangerous characters', () => {
    expect(sanitizeInput('test<script')).toBe('testscript');
    expect(sanitizeInput('value">alert()')).toBe('valuealert()');
    expect(sanitizeInput("test'; DROP TABLE--")).toBe("test' TABLE--");
  });

  test('should remove SQL injection attempts', () => {
    expect(sanitizeInput("1' OR '1'='1")).toBe("1' OR '1'='1");
    expect(sanitizeInput('admin\';--')).toBe('admin\';--');
    expect(sanitizeInput('1 UNION SELECT * FROM users')).toBe('1  * FROM users');
  });

  test('should preserve safe characters', () => {
    expect(sanitizeInput('Safe text 123')).toBe('Safe text 123');
    expect(sanitizeInput('Email: test@example.com')).toBe('Email: test@example.com');
    expect(sanitizeInput('Price: $19.99')).toBe('Price: $19.99');
  });

  test('should trim whitespace', () => {
    expect(sanitizeInput('  text  ')).toBe('text');
    expect(sanitizeInput('\n\ttext\n')).toBe('text');
  });

  test('should handle null and undefined', () => {
    expect(sanitizeInput(null)).toBe('');
    expect(sanitizeInput(undefined)).toBe('');
  });
});

describe('Task Input Validation', () => {
  test('should accept valid task inputs', () => {
    const result = validateTaskInput('Task Title', 'Task description');
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('should reject empty title', () => {
    const result = validateTaskInput('', 'Description');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Title is required');
  });

  test('should reject empty description', () => {
    const result = validateTaskInput('Title', '');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Description is required');
  });

  test('should reject title longer than 100 characters', () => {
    const longTitle = 'a'.repeat(101);
    const result = validateTaskInput(longTitle, 'Description');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Title must not exceed 100 characters');
  });

  test('should reject description longer than 500 characters', () => {
    const longDesc = 'a'.repeat(501);
    const result = validateTaskInput('Title', longDesc);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Description must not exceed 500 characters');
  });

  test('should reject inputs with script tags', () => {
    const result = validateTaskInput('<script>alert("xss")</script>', 'Desc');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Title contains invalid characters');
  });
});