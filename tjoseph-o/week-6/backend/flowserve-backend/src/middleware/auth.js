const jwt = require('jsonwebtoken');
const { AppError } = require('./error');
const { User } = require('../models');

const protect = async (req, res, next) => {
  try {
    // 1) Get token from header
    let token;
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new AppError(401, 'Please log in to access this resource');
    }

    // 2) Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const user = await User.findByPk(decoded.id);
    if (!user) {
      throw new AppError(401, 'The user belonging to this token no longer exists');
    }

    // 4) Check if user is active
    if (user.status !== 'active') {
      throw new AppError(401, 'This user account is not active');
    }

    // Grant access to protected route
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      next(new AppError(401, 'Invalid token. Please log in again'));
    } else {
      next(error);
    }
  }
};

module.exports = {
  protect
};