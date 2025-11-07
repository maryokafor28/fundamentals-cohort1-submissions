const jwt = require('jsonwebtoken');
const HttpError = require('../models/errorModel');

const authMiddleware = async (req, res, next) => {
  try {
    // Check for token in Authorization header first
    const authHeader = req.headers.authorization;
    let token = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      // Fallback to cookie if no Authorization header
      token = req.cookies.token;
    }

    if (!token) {
      return next(new HttpError('Unauthorized. No token provided', 401));
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return next(new HttpError('Unauthorized. Invalid or expired token', 401));
      }

      req.user = decoded; // Attach decoded user data (like id)
      next();
    });
  } catch (error) {
    return next(new HttpError('Authentication failed', 500));
  }
};

module.exports = authMiddleware;