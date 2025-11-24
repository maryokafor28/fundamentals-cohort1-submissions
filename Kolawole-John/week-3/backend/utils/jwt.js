// backend/utils/jwt.js
// JWT Token Generation and Verification

const jwt = require('jsonwebtoken');

/**
 * Generate Access Token (Short-lived: 15 minutes)
 * Used for making API requests
 */
function generateAccessToken(user) {
  const payload = {
    userId: user._id,
    username: user.username,
    email: user.email,
    role: user.role
  };
  
  return jwt.sign(
    payload,
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: '15m' } // 15 minutes
  );
}

/**
 * Generate Refresh Token (Long-lived: 7 days)
 * Used to get new access tokens without re-login
 */
function generateRefreshToken(user) {
  const payload = {
    userId: user._id,
    username: user.username
  };
  
  return jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' } // 7 days
  );
}

/**
 * Verify Access Token
 * Returns decoded payload or throws error
 */
function verifyAccessToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired access token');
  }
}

/**
 * Verify Refresh Token
 * Returns decoded payload or throws error
 */
function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
}

/**
 * Generate both tokens at once (login/register)
 */
function generateTokenPair(user) {
  return {
    accessToken: generateAccessToken(user),
    refreshToken: generateRefreshToken(user)
  };
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  generateTokenPair
};