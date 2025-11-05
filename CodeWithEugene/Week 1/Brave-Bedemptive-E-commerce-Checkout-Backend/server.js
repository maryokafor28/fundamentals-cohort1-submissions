const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Database connection
const { connectDB } = require('./src/config/database');

// Middleware
const errorHandler = require('./src/middleware/errorHandler');

// Routes
const cartRoutes = require('./src/routes/cartRoutes');

// Initialize Express app
const app = express();

// Connect to database
connectDB();

// Security middleware
app.use(helmet());

// CORS middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Cart Service is running successfully',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/', cartRoutes);

// Welcome route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Brave Redemptive E-commerce Cart Service API',
    version: '1.0.0',
    endpoints: {
      'GET /health': 'Health check',
      'GET /get-cart/:userId': 'Get user cart',
      'POST /add-to-cart': 'Add item to cart',
      'PUT /update-cart-item': 'Update cart item quantity',
      'DELETE /remove-from-cart': 'Remove item from cart',
      'DELETE /clear-cart/:userId': 'Clear entire cart'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`
🚀 Cart Service Server is running!
📍 Environment: ${process.env.NODE_ENV || 'development'}
🌐 URL: http://localhost:${PORT}
⚡ Health Check: http://localhost:${PORT}/health
📚 API Docs: http://localhost:${PORT}/
  `);
});

// Handle server shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
  });
});

module.exports = app;
