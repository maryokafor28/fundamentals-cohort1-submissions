const authService = require('../../src/services/authService');
const db = require('../../src/models/db');
const bcrypt = require('bcryptjs');

describe('AuthService - Unit Tests', () => {
  beforeEach(() => {
    // Clear database before each test
    db.clear();
  });

  describe('register()', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      const user = await authService.register(userData);

      expect(user).toBeDefined();
      expect(user.id).toBeDefined();
      expect(user.name).toBe(userData.name);
      expect(user.email).toBe(userData.email);
      expect(user.password).toBeUndefined(); // Password should not be returned
    });

    it('should hash the password before storing', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      await authService.register(userData);
      const storedUser = db.findUserByEmail(userData.email);

      expect(storedUser.password).not.toBe(userData.password);
      expect(storedUser.password.length).toBeGreaterThan(20); // Hashed password length
    });

    it('should throw error if user already exists', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      await authService.register(userData);

      await expect(authService.register(userData)).rejects.toThrow(
        'User already exists with this email'
      );
    });
  });

  describe('login()', () => {
    beforeEach(async () => {
      // Create a test user
      await authService.register({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('should login with correct credentials', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'password123',
      };

      const result = await authService.login(credentials);

      expect(result).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.token).toBeDefined();
      expect(result.user.email).toBe(credentials.email);
      expect(result.user.password).toBeUndefined();
    });

    it('should throw error with incorrect email', async () => {
      const credentials = {
        email: 'wrong@example.com',
        password: 'password123',
      };

      await expect(authService.login(credentials)).rejects.toThrow(
        'Invalid credentials'
      );
    });

    it('should throw error with incorrect password', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      await expect(authService.login(credentials)).rejects.toThrow(
        'Invalid credentials'
      );
    });
  });

  describe('generateToken()', () => {
    it('should generate a valid JWT token', () => {
      const userId = 1;
      const token = authService.generateToken(userId);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });
  });

  describe('verifyToken()', () => {
    it('should verify a valid token', () => {
      const userId = 1;
      const token = authService.generateToken(userId);

      const decoded = authService.verifyToken(token);

      expect(decoded).toBeDefined();
      expect(decoded.userId).toBe(userId);
    });

    it('should throw error for invalid token', () => {
      const invalidToken = 'invalid.token.here';

      expect(() => authService.verifyToken(invalidToken)).toThrow('Invalid token');
    });

    it('should throw error for malformed token', () => {
      const malformedToken = 'not-a-valid-jwt';

      expect(() => authService.verifyToken(malformedToken)).toThrow('Invalid token');
    });
  });

  describe('getUserById()', () => {
    it('should return user without password', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      const registeredUser = await authService.register(userData);
      const fetchedUser = authService.getUserById(registeredUser.id);

      expect(fetchedUser).toBeDefined();
      expect(fetchedUser.id).toBe(registeredUser.id);
      expect(fetchedUser.email).toBe(userData.email);
      expect(fetchedUser.password).toBeUndefined();
    });

    it('should throw error if user not found', () => {
      expect(() => authService.getUserById(999)).toThrow('User not found');
    });
  });
});
