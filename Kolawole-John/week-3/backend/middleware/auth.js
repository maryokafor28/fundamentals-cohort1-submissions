// backend/middleware/auth.js
// Authentication and Authorization Middleware

const { verifyAccessToken } = require('../utils/jwt');

/**
 * Authentication Middleware
 * Verifies that user has a valid access token
 * Adds user info to req.user for use in controllers
 */
function authenticate(req, res, next) {
  try {
    // Get token from Authorization header
    // Format: "Bearer <token>"
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Access denied.'
      });
    }
    
    // Extract token (remove "Bearer " prefix)
    const token = authHeader.substring(7);
    
    // Verify token
    const decoded = verifyAccessToken(token);
    
    // Add user info to request object
    req.user = decoded;
    
    // Continue to next middleware/controller
    next();
    
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token. Please login again.'
    });
  }
}

/**
 * Authorization Middleware - Check User Role
 * Usage: authorize(['admin']) or authorize(['user', 'admin'])
 */
function authorize(roles = []) {
  return (req, res, next) => {
    // Check if user is authenticated first
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    // Check if user's role is allowed
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${roles.join(' or ')}. Your role: ${req.user.role}`
      });
    }
    
    // User has correct role, proceed
    next();
  };
}

/**
 * Admin-only middleware (shortcut)
 */
function adminOnly(req, res, next) {
  return authorize(['admin'])(req, res, next);
}

/**
 * Authenticated users only (both user and admin)
 */
function authenticatedOnly(req, res, next) {
  return authorize(['user', 'admin'])(req, res, next);
}

module.exports = {
  authenticate,
  authorize,
  adminOnly,
  authenticatedOnly
};