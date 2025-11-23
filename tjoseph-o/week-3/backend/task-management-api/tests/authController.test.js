require('./setup');
const User = require('../models/User');
const BlacklistedToken = require('../models/BlacklistedToken');
const bcrypt = require('bcrypt');
const {
  register,
  login,
  refresh,
  logout
} = require('../controllers/authController');

describe('Register Controller', () => {
  test('should register a new user successfully', async () => {
    const req = {
      body: {
        email: 'test@example.com',
        password: 'SecurePass123!'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        message: expect.any(String)
      })
    );

    const user = await User.findOne({ email: 'test@example.com' });
    expect(user).toBeDefined();
    expect(user.role).toBe('user');
  });

  test('should hash the password', async () => {
    const req = {
      body: {
        email: 'hash@example.com',
        password: 'PlainPassword123!'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await register(req, res);

    const user = await User.findOne({ email: 'hash@example.com' });
    expect(user.password).not.toBe('PlainPassword123!');
    
    const isMatch = await bcrypt.compare('PlainPassword123!', user.password);
    expect(isMatch).toBe(true);
  });

  test('should reject duplicate email', async () => {
    await User.create({
      email: 'duplicate@example.com',
      password: 'hashed',
      role: 'user'
    });

    const req = {
      body: {
        email: 'duplicate@example.com',
        password: 'SecurePass123!'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: expect.stringContaining('already exists')
      })
    );
  });

  test('should reject invalid email', async () => {
    const req = {
      body: {
        email: 'invalid-email',
        password: 'SecurePass123!'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false
      })
    );
  });

  test('should reject weak password', async () => {
    const req = {
      body: {
        email: 'weak@example.com',
        password: 'weak'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        errors: expect.any(Array)
      })
    );
  });
});

describe('Login Controller', () => {
  beforeEach(async () => {
    const hashedPassword = await bcrypt.hash('SecurePass123!', 12);
    await User.create({
      email: 'login@example.com',
      password: hashedPassword,
      role: 'user'
    });
  });

  test('should login successfully with valid credentials', async () => {
    const req = {
      body: {
        email: 'login@example.com',
        password: 'SecurePass123!'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
        user: expect.objectContaining({
          email: 'login@example.com',
          role: 'user'
        })
      })
    );
  });

  test('should increment failed login attempts on wrong password', async () => {
    const req = {
      body: {
        email: 'login@example.com',
        password: 'WrongPassword123!'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await login(req, res);

    const user = await User.findOne({ email: 'login@example.com' });
    expect(user.failedLoginAttempts).toBe(1);
  });

  test('should lock account after 3 failed attempts', async () => {
    const req = {
      body: {
        email: 'login@example.com',
        password: 'WrongPassword123!'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Attempt 1
    await login(req, res);
    // Attempt 2
    await login(req, res);
    // Attempt 3
    await login(req, res);

    const user = await User.findOne({ email: 'login@example.com' });
    expect(user.lockUntil).toBeDefined();
    expect(user.lockUntil.getTime()).toBeGreaterThan(Date.now());
  });

  test('should reject login when account is locked', async () => {
    await User.updateOne(
      { email: 'login@example.com' },
      { 
        lockUntil: new Date(Date.now() + 30 * 60 * 1000),
        failedLoginAttempts: 3
      }
    );

    const req = {
      body: {
        email: 'login@example.com',
        password: 'SecurePass123!'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(423);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: expect.stringContaining('locked')
      })
    );
  });

  test('should reset failed attempts on successful login', async () => {
    await User.updateOne(
      { email: 'login@example.com' },
      { failedLoginAttempts: 2 }
    );

    const req = {
      body: {
        email: 'login@example.com',
        password: 'SecurePass123!'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await login(req, res);

    const user = await User.findOne({ email: 'login@example.com' });
    expect(user.failedLoginAttempts).toBe(0);
    expect(user.lockUntil).toBeNull();
  });

  test('should store refresh token in user record', async () => {
    const req = {
      body: {
        email: 'login@example.com',
        password: 'SecurePass123!'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await login(req, res);

    const user = await User.findOne({ email: 'login@example.com' });
    expect(user.refreshTokens).toHaveLength(1);
    expect(user.refreshTokens[0].token).toBeDefined();
  });
});

describe('Refresh Token Controller', () => {
  let validRefreshToken;
  let userId;

  beforeEach(async () => {
    const hashedPassword = await bcrypt.hash('SecurePass123!', 12);
    const user = await User.create({
      email: 'refresh@example.com',
      password: hashedPassword,
      role: 'user'
    });
    
    userId = user._id;
    
    const { generateRefreshToken } = require('../utils/jwtUtils');
    validRefreshToken = generateRefreshToken({ 
      userId: userId.toString(), 
      tokenId: 'test-token-id' 
    });
    
    await User.updateOne(
      { _id: userId },
      { $push: { refreshTokens: { token: validRefreshToken } } }
    );
  });

  test('should generate new access token with valid refresh token', async () => {
    const req = {
      body: {
        refreshToken: validRefreshToken
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await refresh(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        accessToken: expect.any(String)
      })
    );
  });

  test('should reject invalid refresh token', async () => {
    const req = {
      body: {
        refreshToken: 'invalid.token.here'
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await refresh(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false
      })
    );
  });

  test('should reject refresh token not in user record', async () => {
    const { generateRefreshToken } = require('../utils/jwtUtils');
    const unauthorizedToken = generateRefreshToken({ 
      userId: userId.toString(), 
      tokenId: 'different-id' 
    });

    const req = {
      body: {
        refreshToken: unauthorizedToken
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await refresh(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });
});

describe('Logout Controller', () => {
  let validRefreshToken;
  let userId;

  beforeEach(async () => {
    const hashedPassword = await bcrypt.hash('SecurePass123!', 12);
    const user = await User.create({
      email: 'logout@example.com',
      password: hashedPassword,
      role: 'user'
    });
    
    userId = user._id;
    
    const { generateRefreshToken } = require('../utils/jwtUtils');
    validRefreshToken = generateRefreshToken({ 
      userId: userId.toString(), 
      tokenId: 'logout-token-id' 
    });
    
    await User.updateOne(
      { _id: userId },
      { $push: { refreshTokens: { token: validRefreshToken } } }
    );
  });

  test('should logout successfully and blacklist token', async () => {
    const req = {
      body: {
        refreshToken: validRefreshToken
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await logout(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        message: expect.stringContaining('Logged out')
      })
    );
  });

  test('should remove refresh token from user record', async () => {
    const req = {
      body: {
        refreshToken: validRefreshToken
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await logout(req, res);

    const user = await User.findById(userId);
    expect(user.refreshTokens).toHaveLength(0);
  });

  test('should add token to blacklist', async () => {
    const BlacklistedToken = require('../models/BlacklistedToken');
    
    const req = {
      body: {
        refreshToken: validRefreshToken
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await logout(req, res);

    const blacklisted = await BlacklistedToken.findOne({ 
      token: validRefreshToken 
    });
    expect(blacklisted).toBeDefined();
  });
});