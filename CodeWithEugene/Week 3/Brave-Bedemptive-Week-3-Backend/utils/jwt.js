const jwt = require('jsonwebtoken');
const RefreshToken = require('../models/RefreshToken');

// JWT configuration
const JWT_CONFIG = {
  accessSecret: process.env.JWT_ACCESS_SECRET || 'fallback-access-secret',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret',
  accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
};

/**
 * Generate access token
 * @param {Object} payload - User data to include in token
 * @returns {string} Access token
 */
const generateAccessToken = (payload) => {
  return jwt.sign(
    {
      userId: payload.userId,
      username: payload.username,
      email: payload.email,
      role: payload.role
    },
    JWT_CONFIG.accessSecret,
    {
      expiresIn: JWT_CONFIG.accessExpiresIn,
      issuer: 'secure-task-manager',
      audience: 'task-manager-client'
    }
  );
};

/**
 * Generate refresh token
 * @param {Object} payload - User data to include in token
 * @returns {string} Refresh token
 */
const generateRefreshToken = (payload) => {
  return jwt.sign(
    {
      userId: payload.userId,
      type: 'refresh'
    },
    JWT_CONFIG.refreshSecret,
    {
      expiresIn: JWT_CONFIG.refreshExpiresIn,
      issuer: 'secure-task-manager',
      audience: 'task-manager-client'
    }
  );
};

/**
 * Verify access token
 * @param {string} token - Access token to verify
 * @returns {Object} Decoded token payload
 */
const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, JWT_CONFIG.accessSecret, {
      issuer: 'secure-task-manager',
      audience: 'task-manager-client'
    });
  } catch (error) {
    throw new Error('Invalid or expired access token');
  }
};

/**
 * Verify refresh token
 * @param {string} token - Refresh token to verify
 * @returns {Object} Decoded token payload
 */
const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, JWT_CONFIG.refreshSecret, {
      issuer: 'secure-task-manager',
      audience: 'task-manager-client'
    });
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
};

/**
 * Generate token pair (access + refresh)
 * @param {Object} user - User object
 * @param {string} userAgent - Client user agent
 * @param {string} ipAddress - Client IP address
 * @returns {Object} Token pair with refresh token record
 */
const generateTokenPair = async (user, userAgent, ipAddress) => {
  const payload = {
    userId: user._id,
    username: user.username,
    email: user.email,
    role: user.role
  };
  
  const accessToken = generateAccessToken(payload);
  const refreshTokenString = generateRefreshToken(payload);
  
  // Store refresh token in database
  const refreshTokenRecord = await RefreshToken.createToken(
    user._id,
    userAgent,
    ipAddress
  );
  
  return {
    accessToken,
    refreshToken: refreshTokenString,
    refreshTokenRecord
  };
};

/**
 * Refresh access token using refresh token
 * @param {string} refreshToken - Refresh token string
 * @param {string} userAgent - Client user agent
 * @param {string} ipAddress - Client IP address
 * @returns {Object} New access token and refresh token
 */
const refreshAccessToken = async (refreshToken, userAgent, ipAddress) => {
  // Verify refresh token
  const decoded = verifyRefreshToken(refreshToken);
  
  // Check if refresh token exists and is valid in database
  const refreshTokenRecord = await RefreshToken.findAndValidate(refreshToken);
  
  if (!refreshTokenRecord) {
    throw new Error('Invalid or expired refresh token');
  }
  
  // Get user data
  const user = refreshTokenRecord.userId;
  if (!user || !user.isActive) {
    throw new Error('User not found or inactive');
  }
  
  // Generate new token pair
  const newTokens = await generateTokenPair(user, userAgent, ipAddress);
  
  // Revoke old refresh token
  await RefreshToken.revokeToken(refreshToken);
  
  return newTokens;
};

/**
 * Revoke refresh token
 * @param {string} refreshToken - Refresh token to revoke
 * @returns {boolean} Success status
 */
const revokeRefreshToken = async (refreshToken) => {
  try {
    await RefreshToken.revokeToken(refreshToken);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Revoke all refresh tokens for a user
 * @param {string} userId - User ID
 * @returns {boolean} Success status
 */
const revokeAllUserTokens = async (userId) => {
  try {
    await RefreshToken.revokeAllUserTokens(userId);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Extract token from Authorization header
 * @param {string} authHeader - Authorization header value
 * @returns {string|null} Token or null
 */
const extractTokenFromHeader = (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
};

/**
 * Get token expiration time
 * @param {string} token - JWT token
 * @returns {Date|null} Expiration date or null
 */
const getTokenExpiration = (token) => {
  try {
    const decoded = jwt.decode(token);
    return decoded ? new Date(decoded.exp * 1000) : null;
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  generateTokenPair,
  refreshAccessToken,
  revokeRefreshToken,
  revokeAllUserTokens,
  extractTokenFromHeader,
  getTokenExpiration
};
