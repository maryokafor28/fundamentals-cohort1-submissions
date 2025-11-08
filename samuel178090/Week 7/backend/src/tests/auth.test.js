const AuthService = require('../modules/auth/authService');

describe('AuthService Unit Tests', () => {
  describe('login', () => {
    test('should login with valid credentials', async () => {
      const result = await AuthService.login('admin@test.com', 'password');
      
      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('user');
      expect(result.user.email).toBe('admin@test.com');
      expect(result.user.role).toBe('admin');
    });

    test('should throw error with invalid email', async () => {
      await expect(AuthService.login('invalid@test.com', 'password'))
        .rejects.toThrow('Invalid credentials');
    });

    test('should throw error with invalid password', async () => {
      await expect(AuthService.login('admin@test.com', 'wrongpassword'))
        .rejects.toThrow('Invalid credentials');
    });

    test('should throw error with missing email', async () => {
      await expect(AuthService.login('', 'password'))
        .rejects.toThrow('Email and password are required');
    });

    test('should throw error with missing password', async () => {
      await expect(AuthService.login('admin@test.com', ''))
        .rejects.toThrow('Email and password are required');
    });
  });

  describe('register', () => {
    test('should register new user successfully', async () => {
      const result = await AuthService.register('newuser@test.com', 'password123');
      
      expect(result).toHaveProperty('id');
      expect(result.email).toBe('newuser@test.com');
      expect(result.role).toBe('user');
    });

    test('should throw error for duplicate email', async () => {
      await expect(AuthService.register('admin@test.com', 'password'))
        .rejects.toThrow('User already exists');
    });

    test('should throw error with missing email', async () => {
      await expect(AuthService.register('', 'password'))
        .rejects.toThrow('Email and password are required');
    });
  });

  describe('verifyToken', () => {
    test('should verify valid token', async () => {
      const loginResult = await AuthService.login('admin@test.com', 'password');
      const decoded = AuthService.verifyToken(loginResult.token);
      
      expect(decoded.email).toBe('admin@test.com');
      expect(decoded.role).toBe('admin');
    });

    test('should throw error for invalid token', () => {
      expect(() => AuthService.verifyToken('invalid-token'))
        .toThrow('Invalid token');
    });
  });
});