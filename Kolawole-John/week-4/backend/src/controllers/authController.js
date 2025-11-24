const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { sendTokenResponse } = require('../utils/jwt');

// Register user
exports.signup = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  // Validate input
  if (!name || !email || !password) {
    return res.status(400).json({
      status: 'error',
      message: 'Please provide all required fields',
    });
  }

  // Check if user exists
  const existingUser = await User.findOne({ email }).lean();
  if (existingUser) {
    return res.status(400).json({
      status: 'error',
      message: 'Email already registered',
    });
  }

  // Create user (password auto-hashed by pre-save hook)
  const user = await User.create({ name, email, password });

  // Send token
  sendTokenResponse(user, 201, res);
});

// Login user
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: 'error',
      message: 'Please provide email and password',
    });
  }

  // Get user with password (normally excluded)
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid credentials',
    });
  }

  // Check password
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid credentials',
    });
  }

  user.password = undefined;  // Remove from response
  sendTokenResponse(user, 200, res);
});

// Get current user
exports.getMe = asyncHandler(async (req, res, next) => {
  // req.user set by protect middleware
  res.status(200).json({
    status: 'success',
    data: { user: req.user },
  });
});

// Logout
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully',
  });
});