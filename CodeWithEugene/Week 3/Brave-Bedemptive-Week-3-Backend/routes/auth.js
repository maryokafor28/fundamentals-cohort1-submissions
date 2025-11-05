const express = require('express');
const rateLimit = require('express-rate-limit');
const User = require('../models/User');
const { generateTokenPair, refreshAccessToken, revokeRefreshToken, revokeAllUserTokens } = require('../utils/jwt');
const { 
  validateEmail, 
  validateUsername, 
  validatePassword 
} = require('../utils/validation');
const { authenticate } = require('../middleware/auth');
const { AppError } = require('../middleware/errorHandler');

const router = express.Router();

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 60 * 1000, // 15 minutes
  max: 3, // limit each IP to 3 login attempts per windowMs
  message: 'Too many login attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', authLimiter, async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    
    // Validate input data
    if (!username || !email || !password) {
      throw new AppError('Username, email, and password are required', 400, 'MISSING_FIELDS');
    }
    
    // Sanitize and validate inputs
    const sanitizedUsername = validateUsername(username);
    const sanitizedEmail = validateEmail(email);
    const validatedPassword = validatePassword(password);
    
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { email: sanitizedEmail },
        { username: sanitizedUsername }
      ]
    });
    
    if (existingUser) {
      if (existingUser.email === sanitizedEmail) {
        throw new AppError('Email already registered', 409, 'EMAIL_EXISTS');
      } else {
        throw new AppError('Username already taken', 409, 'USERNAME_EXISTS');
      }
    }
    
    // Create new user
    const user = new User({
      username: sanitizedUsername,
      email: sanitizedEmail,
      password: validatedPassword
    });
    
    await user.save();
    
    // Generate tokens
    const userAgent = req.get('User-Agent') || '';
    const ipAddress = req.ip || req.connection.remoteAddress;
    const tokens = await generateTokenPair(user, userAgent, ipAddress);
    
    // Set refresh token as HttpOnly cookie
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      accessToken: tokens.accessToken
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', loginLimiter, async (req, res, next) => {
  try {
    const { identifier, password } = req.body;
    
    // Validate input data
    if (!identifier || !password) {
      throw new AppError('Email/username and password are required', 400, 'MISSING_FIELDS');
    }
    
    // Sanitize identifier (could be email or username)
    const sanitizedIdentifier = identifier.trim().toLowerCase();
    
    // Find user and validate credentials
    const user = await User.findByCredentials(sanitizedIdentifier, password);
    
    // Generate tokens
    const userAgent = req.get('User-Agent') || '';
    const ipAddress = req.ip || req.connection.remoteAddress;
    const tokens = await generateTokenPair(user, userAgent, ipAddress);
    
    // Set refresh token as HttpOnly cookie
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      accessToken: tokens.accessToken
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
router.post('/refresh', async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    
    if (!refreshToken) {
      throw new AppError('Refresh token not provided', 401, 'NO_REFRESH_TOKEN');
    }
    
    const userAgent = req.get('User-Agent') || '';
    const ipAddress = req.ip || req.connection.remoteAddress;
    
    // Refresh the access token
    const tokens = await refreshAccessToken(refreshToken, userAgent, ipAddress);
    
    // Set new refresh token as HttpOnly cookie
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    res.json({
      message: 'Token refreshed successfully',
      accessToken: tokens.accessToken
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (revoke refresh token)
 * @access  Private
 */
router.post('/logout', authenticate, async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    
    if (refreshToken) {
      await revokeRefreshToken(refreshToken);
    }
    
    // Clear refresh token cookie
    res.clearCookie('refreshToken');
    
    res.json({
      message: 'Logout successful'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/auth/logout-all
 * @desc    Logout user from all devices (revoke all refresh tokens)
 * @access  Private
 */
router.post('/logout-all', authenticate, async (req, res, next) => {
  try {
    await revokeAllUserTokens(req.user.id);
    
    // Clear refresh token cookie
    res.clearCookie('refreshToken');
    
    res.json({
      message: 'Logged out from all devices successfully'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', authenticate, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }
    
    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', authenticate, async (req, res, next) => {
  try {
    const { username, email } = req.body;
    const userId = req.user.id;
    
    // Validate input data
    if (!username && !email) {
      throw new AppError('At least one field (username or email) is required', 400, 'MISSING_FIELDS');
    }
    
    const updateData = {};
    
    if (username) {
      updateData.username = validateUsername(username);
    }
    
    if (email) {
      updateData.email = validateEmail(email);
    }
    
    // Check for duplicates
    if (username || email) {
      const existingUser = await User.findOne({
        $and: [
          { _id: { $ne: userId } },
          {
            $or: [
              ...(username ? [{ username: updateData.username }] : []),
              ...(email ? [{ email: updateData.email }] : [])
            ]
          }
        ]
      });
      
      if (existingUser) {
        if (existingUser.username === updateData.username) {
          throw new AppError('Username already taken', 409, 'USERNAME_EXISTS');
        } else {
          throw new AppError('Email already registered', 409, 'EMAIL_EXISTS');
        }
      }
    }
    
    // Update user
    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
