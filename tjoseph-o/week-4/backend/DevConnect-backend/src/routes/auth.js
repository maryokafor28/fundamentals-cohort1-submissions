const express = require('express');
const { 
  register, 
  login, 
  getProfile,
  updateProfile,
  getUserById, 
  getUserProjects 
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();


router.post('/register', register);
router.post('/login', login);
router.get('/user/:id', getUserById);
router.get('/user/:id/projects', getUserProjects);


router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

module.exports = router;