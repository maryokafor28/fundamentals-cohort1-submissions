// backend/routes/authRoutes.js
// Authentication routes

const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  register,
  login,
  refreshToken,
  logout,
  getCurrentUser
} = require('../controllers/authController');

// Public routes (no authentication required)
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);

// Protected routes (authentication required)
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getCurrentUser);

module.exports = router;