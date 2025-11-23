const express = require('express');
const authRoutes = require('./auth');
const cartRoutes = require('./cart');

const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'E-commerce Cart Service is healthy',
    timestamp: new Date().toISOString(),
    service: 'cart-service',
    version: '1.0.0'
  });
});

router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'E-commerce Cart Service API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      cart: '/api/cart'
    },
    documentation: 'See README.md for API documentation'
  });
});

router.use('/auth', authRoutes);
router.use('/', cartRoutes); 

module.exports = router;