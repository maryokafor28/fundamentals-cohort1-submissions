import dotenv from 'dotenv';
import app from './app.js';
import logger from './config/logger.js';
import { createRequire } from 'module';

// Load environment variables
dotenv.config();

const require = createRequire(import.meta.url);
const packageJson = require('../package.json');

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Create logs directory if it doesn't exist
import { mkdirSync } from 'fs';
try {
  mkdirSync('logs', { recursive: true });
} catch (err) {
  // Directory might already exist
}

// Start server
const server = app.listen(PORT, () => {
  logger.info('='.repeat(50));
  logger.info(`Server started successfully`);
  logger.info(`Environment: ${NODE_ENV}`);
  logger.info(`Version: ${packageJson.version}`);
  logger.info(`Port: ${PORT}`);
  logger.info(`Process ID: ${process.pid}`);
  logger.info(`Node Version: ${process.version}`);
  logger.info('='.repeat(50));
  logger.info(`Health Check: http://localhost:${PORT}/api/health`);
  logger.info(`Metrics: http://localhost:${PORT}/api/metrics`);
  logger.info('='.repeat(50));
});

// Export server for testing
export default server;