const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  refresh, 
  logout 
} = require('../controllers/authController');
const { 
  validateRegistration, 
  validateLogin 
} = require('../middleware/validate');


router.post('/register', validateRegistration, register);

router.post('/login', validateLogin, login);

router.post('/refresh', refresh);


router.post('/logout', logout);

module.exports = router;