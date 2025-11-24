import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import config from './config';
import logger from './config/logger';

// Middleware
import { requestLogger, performanceMonitor, requestId } from './middleware/requestLogger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { standardLimiter } from './middleware/rateLimiter';

// Routes
import healthRoutes from './routes/health';
import v1Routes from './routes/v1/index';
import v2PaymentRoutes from './routes/v2/payments';
import v2CustomerRoutes from './routes/v2/customers';

// Services (for initialization)
import { cacheService } from './services/cacheServices';

/**
 * Create and configure Express application
 */
function createApp(): Application {
  const app = express();

  // ============ Core Middleware ============

  // Security headers
  app.use(helmet({
    contentSecurityPolicy: false, // Disable for API
    crossOriginEmbedderPolicy: false,
  }));

  // CORS configuration
  app.use(cors({
    origin: config.cors.origin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
  }));

  // Log CORS configuration
  if (Array.isArray(config.cors.origin)) {
    logger.info(`📡 CORS Origins configured: ${config.cors.origin.join(', ')}`);
  } else {
    logger.info(`📡 CORS Origins: ${config.cors.origin}`);
  }

  // Compression
  app.use(compression());

  // Body parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Request ID tracking
  app.use(requestId);

  // Request logging
  app.use(requestLogger);

  // Performance monitoring (log requests over 1 second)
  app.use(performanceMonitor(1000));

  // Rate limiting
  app.use('/api/', standardLimiter);

  // ============ Routes ============

  // Health check endpoints (no rate limiting)
  app.use('/health', healthRoutes);

  // API v1 (legacy compatible)
  app.use('/api/v1', v1Routes);

  // API v2 (modern transformed)
  app.use('/api/v2/payments', v2PaymentRoutes);
  app.use('/api/v2/customers', v2CustomerRoutes);

  // Root endpoint
  app.get('/', (_req, res) => {
    res.json({
      service: 'LegacyBridge Integration Service',
      version: '2.0.0',
      status: 'operational',
      endpoints: {
        health: '/health',
        v1: {
          payments: '/api/v1/payments',
          customers: '/api/v1/customers',
        },
        v2: {
          payments: '/api/v2/payments',
          customers: '/api/v2/customers',
          paymentStats: '/api/v2/payments/stats',
        },
      },
      documentation: {
        postman: 'https://documenter.getpostman.com/view/your-collection',
        github: 'https://github.com/your-username/legacybridge-backend',
      },
    });
  });

  // ============ Error Handling ============

  // 404 handler
  app.use(notFoundHandler);

  // Global error handler (must be last)
  app.use(errorHandler);

  return app;
}

/**
 * Initialize services
 */
async function initializeServices(): Promise<void> {
  logger.info('Initializing services...');

  try {
    // Start cache cleanup interval
    console.log('Starting cache cleanup interval');
    cacheService.startCleanupInterval(60000); // Clean every minute
    console.log('Cache cleanup interval started');

    logger.info('All services initialized successfully');
  } catch (error) {
    console.error('ERROR in initializeServices:', error);
    logger.error('Failed to initialize services', error);
    throw error;
  }
}

/**
 * Graceful shutdown
 */
async function shutdown(): Promise<void> {
  logger.info('Shutting down gracefully...');

  try {
    // Disconnect cache
    await cacheService.disconnect();

    logger.info('Shutdown complete');
  } catch (error) {
    logger.error('Error during shutdown', error);
    throw error;
  }
}

const app = createApp();

export default app;
export { initializeServices, shutdown };