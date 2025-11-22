import express from 'express';
import cors from 'cors';
import 'express-async-errors';
import logger from './config/logger.js';
import { requestLogger, errorLogger } from './middleware/logger.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import systemRoutes from './routes/system.js';
import deploymentRoutes from './routes/deployments.js';

const app = express();

// Trust proxy (for deployment behind reverse proxies)
app.set('trust proxy', 1);

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use(requestLogger);

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'DeployHub Backend API',
    version: process.env.APP_VERSION || '1.0.0',
    status: 'running',
    documentation: '/api/health',
    endpoints: {
      health: '/api/health',
      metrics: '/api/metrics',
      info: '/api/info',
      stats: '/api/stats',
      deployments: '/api/deployments'
    }
  });
});

// API Routes
app.use('/api', systemRoutes);
app.use('/api/deployments', deploymentRoutes);

// Error logging middleware
app.use(errorLogger);

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

// Graceful shutdown handler
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception', { error: err.message, stack: err.stack });
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', { reason, promise });
  process.exit(1);
});

export default app;