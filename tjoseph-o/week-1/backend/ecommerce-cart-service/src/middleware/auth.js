const jwt = require('jsonwebtoken');
const User = require('../models/User');


const auth = async (req, res, next) => {
  try {
  
    let token = req.header('Authorization') || req.header('x-auth-token');
    
   
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access denied. No token provided.'
      });
    }

   
    if (token.startsWith('Bearer ')) {
      token = token.slice(7);
    } else if (req.header('Authorization') && !req.header('Authorization').startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Access denied. Invalid token format.'
      });
    }

  
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');
    
 
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Access denied. User not found.'
      });
    }

   
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Access denied. User account is inactive.'
      });
    }

   t
    req.user = {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role
    };
    req.token = token;

    next();

  } catch (error) {
    let errorMessage = 'Access denied. Invalid token.';
    
    if (error.name === 'TokenExpiredError') {
      errorMessage = 'Access denied. Token expired.';
    } else if (error.name === 'JsonWebTokenError') {
      errorMessage = 'Access denied. Invalid token.';
    }

    return res.status(401).json({
      success: false,
      error: errorMessage
    });
  }
};

module.exports = auth;