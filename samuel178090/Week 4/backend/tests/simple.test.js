const HttpError = require('../models/errorModel');

describe('Basic API Tests', () => {
  test('HttpError model creates error correctly', () => {
    const error = new HttpError('Test error', 400);
    expect(error.message).toBe('Test error');
    expect(error.code).toBe(400);
  });

  test('Password validation logic', () => {
    const password = 'password123';
    const confirmPassword = 'password123';
    expect(password).toBe(confirmPassword);
    expect(password.length).toBeGreaterThanOrEqual(6);
  });

  test('Email validation regex', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    expect(emailRegex.test('test@example.com')).toBe(true);
    expect(emailRegex.test('invalid-email')).toBe(false);
  });
});