
const express = require('express');
const AuthController = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/register', AuthController.register);


router.post('/login', AuthController.login);


router.post('/refresh-token', AuthController.refreshToken);


router.post('/verify-token', AuthController.verifyToken);


router.post('/logout', auth, AuthController.logout);


router.get('/me', auth, AuthController.getMe);


router.put('/change-password', auth, AuthController.changePassword);

module.exports = router;