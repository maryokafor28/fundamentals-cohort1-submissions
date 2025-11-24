// backend/controllers/authController.js
// Handle authentication logic: register, login, refresh token, logout

const User = require('../models/User');
const { validateRegistration } = require('../utils/validation');
const { generateTokenPair, verifyRefreshToken } = require('../utils/jwt');

/**
 * Register a new user
 * POST /api/auth/register
 */
async function register(req, res) {
  try {
    const { username, email, password } = req.body;
    
    // Step 1: Validate and sanitize input
    const validation = validateRegistration({ username, email, password });
    
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }
    
    // Step 2: Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { username: validation.data.username },
        { email: validation.data.email }
      ]
    });
    
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Username or email already exists'
      });
    }
    
    // Step 3: Create new user (password will be hashed automatically)
    const newUser = new User({
      username: validation.data.username,
      email: validation.data.email,
      password: validation.data.password,
      role: 'user' // Default role
    });
    
    await newUser.save();
    
    // Step 4: Generate tokens
    const tokens = generateTokenPair(newUser);
    
    // Step 5: Save refresh token to user's account
    await newUser.addRefreshToken(tokens.refreshToken);
    
    // Step 6: Send response (DON'T send password!)
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message
    });
  }
}

/**
 * Login existing user
 * POST /api/auth/login
 */
async function login(req, res) {
  try {
    const { username, password } = req.body;
    
    // Step 1: Basic validation
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }
    
    // Step 2: Find user
    const user = await User.findOne({ username });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }
    
    // Step 3: Check if account is locked
    if (user.isLocked) {
      const lockTimeRemaining = Math.ceil((user.lockUntil - Date.now()) / 60000);
      return res.status(423).json({
        success: false,
        message: `Account is locked due to too many failed login attempts. Please try again in ${lockTimeRemaining} minutes.`
      });
    }
    
    // Step 4: Verify password
    const isPasswordCorrect = await user.comparePassword(password);
    
    if (!isPasswordCorrect) {
      // Increment failed login attempts
      await user.incLoginAttempts();
      
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password',
        remainingAttempts: 3 - (user.loginAttempts + 1)
      });
    }
    
    // Step 5: Password correct! Reset login attempts
    await user.resetLoginAttempts();
    
    // Step 6: Generate tokens
    const tokens = generateTokenPair(user);
    
    // Step 7: Save refresh token
    await user.addRefreshToken(tokens.refreshToken);
    
    // Step 8: Send response
    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
}

/**
 * Refresh access token
 * POST /api/auth/refresh
 */
async function refreshToken(req, res) {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required'
      });
    }
    
    // Step 1: Verify refresh token
    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token'
      });
    }
    
    // Step 2: Find user and check if token exists in their account
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Step 3: Check if refresh token is in user's list (not revoked)
    const tokenExists = user.refreshTokens.some(rt => rt.token === refreshToken);
    
    if (!tokenExists) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token has been revoked. Please login again.'
      });
    }
    
    // Step 4: Generate new access token (but keep same refresh token)
    const { generateAccessToken } = require('../utils/jwt');
    const newAccessToken = generateAccessToken(user);
    
    // Step 5: Send new access token
    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      accessToken: newAccessToken
    });
    
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during token refresh',
      error: error.message
    });
  }
}

/**
 * Logout user
 * POST /api/auth/logout
 */
async function logout(req, res) {
  try {
    const { refreshToken } = req.body;
    const userId = req.user.userId; // From authenticate middleware
    
    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required'
      });
    }
    
    // Find user and remove the refresh token
    const user = await User.findById(userId);
    
    if (user) {
      await user.removeRefreshToken(refreshToken);
    }
    
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
    
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during logout',
      error: error.message
    });
  }
}

/**
 * Get current user info
 * GET /api/auth/me
 */
async function getCurrentUser(req, res) {
  try {
    const user = await User.findById(req.user.userId).select('-password -refreshTokens');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });
    
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
}

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  getCurrentUser
};