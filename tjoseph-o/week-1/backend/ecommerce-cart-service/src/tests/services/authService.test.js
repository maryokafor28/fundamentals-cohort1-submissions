const AuthService = require('../../services/authService');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');

describe('AuthService', () => {
  describe('register', () => {
    test('should register a new user successfully', async () => {
      const userData = {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'TestPassword123!'
      };

      const result = await AuthService.register(userData);

      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.token).toBeDefined();
      expect(result.user.email).toBe(userData.email);
      expect(result.user.password).toBeUndefined(); 
    });

    test('should fail to register user with existing email', async () => {
      
      const existingUserData = {
        username: 'existinguser',
        email: 'existing@example.com',
        password: 'TestPassword123!'
      };

      const existingUser = new User(existingUserData);
      await existingUser.save();

     
      const newUserData = {
        username: 'newuser',
        email: 'existing@example.com', 
        password: 'TestPassword456!'
      };

      const result = await AuthService.register(newUserData);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Email already exists');
    });

    test('should fail to register user with invalid data', async () => {
      const invalidUserData = {
        username: 'ab', 
        email: 'invalid-email',
        password: '123' 
      };

      const result = await AuthService.register(invalidUserData);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('login', () => {
    let testUser;

    beforeEach(async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'TestPassword123!'
      };

      testUser = new User(userData);
      await testUser.save();
    });

    test('should login user with valid credentials', async () => {
      const result = await AuthService.login('test@example.com', 'TestPassword123!');

      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.token).toBeDefined();
      expect(result.user.email).toBe('test@example.com');
    });

    test('should fail to login with invalid email', async () => {
      const result = await AuthService.login('nonexistent@example.com', 'TestPassword123!');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid credentials');
    });

    test('should fail to login with invalid password', async () => {
      const result = await AuthService.login('test@example.com', 'wrongpassword');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid credentials');
    });

    test('should fail to login with inactive user', async () => {
     
      testUser.isActive = false;
      await testUser.save();

      const result = await AuthService.login('test@example.com', 'TestPassword123!');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid credentials');
    });
  });

  describe('verifyToken', () => {
    let testUser;
    let validToken;

    beforeEach(async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'TestPassword123!'
      };

      testUser = new User(userData);
      await testUser.save();
      validToken = testUser.generateAuthToken();
    });

    test('should verify valid token', async () => {
      const result = await AuthService.verifyToken(validToken);

      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user.id).toBe(testUser._id.toString());
    });

    test('should fail to verify invalid token', async () => {
      const result = await AuthService.verifyToken('invalid.token.here');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid token');
    });

    test('should fail to verify expired token', async () => {
      
      const expiredToken = jwt.sign(
        { id: testUser._id },
        process.env.JWT_SECRET || 'fallback-secret-key',
        { expiresIn: '-1h' } 
      );

      const result = await AuthService.verifyToken(expiredToken);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Token expired');
    });
  });

  describe('refreshToken', () => {
    let testUser;
    let validRefreshToken;

    beforeEach(async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'TestPassword123!'
      };

      testUser = new User(userData);
      await testUser.save();
      validRefreshToken = testUser.generateRefreshToken();
    });

    test('should refresh token with valid refresh token', async () => {
      const result = await AuthService.refreshToken(validRefreshToken);

      expect(result.success).toBe(true);
      expect(result.token).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });

    test('should fail to refresh with invalid refresh token', async () => {
      const result = await AuthService.refreshToken('invalid.refresh.token');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid refresh token');
    });
  });
});