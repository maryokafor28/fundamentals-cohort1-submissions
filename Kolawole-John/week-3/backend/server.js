// backend/server.js
// Main server file - Entry point of the application

require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDatabase = require('./config/database');

// Import routes
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDatabase();

// ============================================
// SECURITY MIDDLEWARE
// ============================================

// Helmet - Sets secure HTTP headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    }
  },
  xssFilter: true,
  noSniff: true,
  referrerPolicy: { policy: 'same-origin' }
}));

// CORS - Configure allowed origins
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : 'http://localhost:5173', // Vite default port
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// ============================================
// BODY PARSERS & COOKIE PARSER
// ============================================

app.use(express.json({ limit: '10mb' })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Parse URL-encoded bodies
app.use(cookieParser()); // Parse cookies

// ============================================
// REQUEST LOGGING (Development only)
// ============================================

if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// ============================================
// ROUTES
// ============================================

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// 404 Handler - Route not found
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// ============================================
// GLOBAL ERROR HANDLER
// ============================================

app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log('');
  console.log('🔒 ================================');
  console.log('🔒 SECURE TASK MANAGEMENT API');
  console.log('🔒 ================================');
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📡 API Base URL: http://localhost:${PORT}/api`);
  console.log('🔒 ================================');
  console.log('');
  console.log('📋 Available Endpoints:');
  console.log('');
  console.log('🔐 Authentication:');
  console.log('   POST   /api/auth/register');
  console.log('   POST   /api/auth/login');
  console.log('   POST   /api/auth/refresh');
  console.log('   POST   /api/auth/logout');
  console.log('   GET    /api/auth/me');
  console.log('');
  console.log('📝 Tasks:');
  console.log('   GET    /api/tasks');
  console.log('   GET    /api/tasks/:id');
  console.log('   POST   /api/tasks');
  console.log('   PUT    /api/tasks/:id');
  console.log('   DELETE /api/tasks/:id (Admin only)');
  console.log('   POST   /api/tasks/search');
  console.log('   POST   /api/tasks/filter');
  console.log('');
  console.log('🔒 ================================');
  console.log('');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Promise Rejection:', error);
  // Close server & exit process
  process.exit(1);
});

module.exports = app;