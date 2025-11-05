const { verifyAccessToken, extractTokenFromHeader } = require('../utils/jwt');
const User = require('../models/User');

/**
 * Authentication middleware to verify JWT access token
 */
const authenticate = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);
    
    if (!token) {
      return res.status(401).json({
        error: 'Access denied. No token provided.',
        code: 'NO_TOKEN'
      });
    }
    
    // Verify the token
    const decoded = verifyAccessToken(token);
    
    // Check if user still exists and is active
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({
        error: 'Access denied. User not found.',
        code: 'USER_NOT_FOUND'
      });
    }
    
    if (!user.isActive) {
      return res.status(401).json({
        error: 'Access denied. User account is inactive.',
        code: 'USER_INACTIVE'
      });
    }
    
    // Add user info to request object
    req.user = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    };
    
    next();
  } catch (error) {
    return res.status(401).json({
      error: 'Access denied. Invalid token.',
      code: 'INVALID_TOKEN',
      details: error.message
    });
  }
};

/**
 * Role-based access control middleware
 * @param {Array|string} allowedRoles - Roles that are allowed to access the route
 */
const authorize = (allowedRoles) => {
  return (req, res, next) => {
    // Ensure user is authenticated first
    if (!req.user) {
      return res.status(401).json({
        error: 'Access denied. Authentication required.',
        code: 'AUTHENTICATION_REQUIRED'
      });
    }
    
    // Convert single role to array
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    
    // Check if user's role is in allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Access denied. Insufficient permissions.',
        code: 'INSUFFICIENT_PERMISSIONS',
        required: roles,
        current: req.user.role
      });
    }
    
    next();
  };
};

/**
 * Middleware to check if user can access a specific task
 * Users can only access their own tasks, admins can access all tasks
 */
const authorizeTaskAccess = async (req, res, next) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role;
    
    // Admin can access all tasks
    if (userRole === 'admin') {
      return next();
    }
    
    // For non-admin users, check if they own the task
    const Task = require('../models/Task');
    const task = await Task.findById(taskId);
    
    if (!task) {
      return res.status(404).json({
        error: 'Task not found.',
        code: 'TASK_NOT_FOUND'
      });
    }
    
    if (task.createdBy.toString() !== userId) {
      return res.status(403).json({
        error: 'Access denied. You can only access your own tasks.',
        code: 'TASK_ACCESS_DENIED'
      });
    }
    
    // Add task to request object for use in route handlers
    req.task = task;
    next();
  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error.',
      code: 'INTERNAL_ERROR',
      details: error.message
    });
  }
};

/**
 * Optional authentication middleware
 * Doesn't fail if no token is provided, but adds user info if token is valid
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);
    
    if (token) {
      const decoded = verifyAccessToken(token);
      const user = await User.findById(decoded.userId).select('-password');
      
      if (user && user.isActive) {
        req.user = {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role
        };
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication if token is invalid
    next();
  }
};

/**
 * Middleware to check if user is admin
 */
const requireAdmin = authorize(['admin']);

/**
 * Middleware to check if user is regular user or admin
 */
const requireUserOrAdmin = authorize(['user', 'admin']);

module.exports = {
  authenticate,
  authorize,
  authorizeTaskAccess,
  optionalAuth,
  requireAdmin,
  requireUserOrAdmin
};
