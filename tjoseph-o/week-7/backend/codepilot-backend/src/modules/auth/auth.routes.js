const express = require('express');
const authController = require('./auth.controller');
const { authenticate, authorize } = require('./auth.middleware');

const router = express.Router();


router.post('/register', authController.register.bind(authController));
router.post('/login', authController.login.bind(authController));


router.get('/profile', authenticate, authController.getProfile.bind(authController));
router.get('/users', authenticate, authorize('admin'), authController.getAllUsers.bind(authController));

module.exports = router;