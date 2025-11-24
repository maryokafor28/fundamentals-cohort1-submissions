import app, { initializeServices, shutdown } from './app';
import config from './config';
import logger from './config/logger';
import { Server } from 'http';

console.log('===== SERVER STARTING =====');

let server: Server;

/**
 * Start the server
 */
async function startServer(): Promise<void> {
  try {
    console.log('1. startServer called');
    
    // Initialize services first
    console.log('2. Calling initializeServices');
    await initializeServices();
    console.log('3. initializeServices completed');

    // Start Express server
    console.log(`4. Creating listener on port ${config.port}`);
    server = app.listen(config.port, () => {
      console.log('5. Server listener callback fired');
      logger.info(`🚀 LegacyBridge Backend running on port ${config.port}`);
      logger.info(`📊 Environment: ${config.nodeEnv}`);
      logger.info(`💾 Cache type: ${config.cache.type}`);
      logger.info(`🔗 Legacy API: ${config.legacyApi.baseUrl}`);
      logger.info(`✅ Server is ready to accept connections`);
      
      if (config.nodeEnv === 'development') {
        logger.info(`📖 API Documentation: http://localhost:${config.port}`);
        logger.info(`❤️  Health Check: http://localhost:${config.port}/health`);
      }
    });

    // Handle server errors
    server.on('error', (error: NodeJS.ErrnoException) => {
      console.error('Server error:', error);
      if (error.code === 'EADDRINUSE') {
        logger.error(`Port ${config.port} is already in use`);
      } else {
        logger.error('Server error:', error);
      }
      process.exit(1);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

/**
 * Graceful shutdown handler
 */
async function gracefulShutdown(signal: string): Promise<void> {
  logger.info(`${signal} received, starting graceful shutdown...`);

  if (server) {
    server.close(async () => {
      logger.info('HTTP server closed');

      try {
        await shutdown();
        logger.info('Graceful shutdown completed');
        process.exit(0);
      } catch (error) {
        logger.error('Error during graceful shutdown:', error);
        process.exit(1);
      }
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10000);
  } else {
    process.exit(0);
  }
}

// Handle shutdown signals
process.on('SIGTERM', async () => {
  console.log('SIGTERM received');
  await gracefulShutdown('SIGTERM');
});
process.on('SIGINT', async () => {
  console.log('SIGINT received');
  await gracefulShutdown('SIGINT');
});

// Handle uncaught exceptions
process.on('uncaughtException', async (error: Error) => {
  console.error('===== UNCAUGHT EXCEPTION =====');
  console.error(error);
  logger.error('Uncaught Exception:', error);
  await gracefulShutdown('uncaughtException');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', async (reason: any, _promise: Promise<any>) => {
  console.error('===== UNHANDLED REJECTION =====');
  console.error(reason);
  logger.error('Unhandled Promise Rejection:', { reason });
  await gracefulShutdown('unhandledRejection');
});

// Start the server
startServer();

export { server };