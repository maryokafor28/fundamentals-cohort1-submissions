const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const requestLogger = require('./middleware/requestLogger');
const errorHandler = require('./middleware/errorHandler');
const healthRoutes = require('./routes/health');
const apiRoutes = require('./routes/api');

const app = express();

// Security middleware
app.use(helmet());

// Performance middleware
app.use(compression());

// ============================================================
// CORS CONFIGURATION - PRODUCTION READY
// ============================================================
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175', // ADD THIS
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5175',
];

// In production, add your deployed frontend URL
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    // Check if origin is in whitelist
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // In development, be permissive with localhost
      if (process.env.NODE_ENV !== 'production' && 
          (origin.includes('localhost') || origin.includes('127.0.0.1'))) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));


// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging and metrics (AFTER body parsing)
app.use(requestLogger);

// ============================================================
// ROUTES - ORDER MATTERS!
// ============================================================
// Mount health routes first (most specific)
app.use('/api', healthRoutes);
app.use('/api', apiRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'DeployHub Backend API',
    version: process.env.npm_package_version || '1.0.0',
    docs: '/api/info',
    health: '/api/health',
  });
});

// 404 handler (catches unmatched routes)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: 'Route not found',
      path: req.url,
      availableEndpoints: [
        '/api/health',
        '/api/ready',
        '/api/live',
        '/api/metrics',
        '/api/status',
        '/api/info',
      ],
    },
  });
});

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;