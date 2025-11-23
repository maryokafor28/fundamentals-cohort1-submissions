import express from 'express';
import { register } from '../config/metrics.js';
import logger from '../config/logger.js';

const router = express.Router();

// System start time for uptime calculation
const startTime = Date.now();

/**
 * @route   GET /api/health
 * @desc    Health check endpoint
 * @access  Public
 */
router.get('/health', (req, res) => {
  const uptime = process.uptime();
  const uptimeFormatted = formatUptime(uptime);
  
  const healthCheck = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: uptimeFormatted,
    uptimeSeconds: Math.floor(uptime),
    service: 'deployhub-backend',
    version: process.env.APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    memory: {
      used: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
      total: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`,
      external: `${Math.round(process.memoryUsage().external / 1024 / 1024)}MB`
    },
    cpu: process.cpuUsage()
  };

  logger.debug('Health check performed', healthCheck);
  
  res.status(200).json(healthCheck);
});

/**
 * @route   GET /api/metrics
 * @desc    Prometheus metrics endpoint
 * @access  Public
 */
router.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  const metrics = await register.metrics();
  res.send(metrics);
});

/**
 * @route   GET /api/info
 * @desc    Application information
 * @access  Public
 */
router.get('/info', (req, res) => {
  const info = {
    name: 'DeployHub Backend',
    description: 'CI/CD and Observability API',
    version: process.env.APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    nodeVersion: process.version,
    platform: process.platform,
    architecture: process.arch,
    startTime: new Date(startTime).toISOString(),
    uptime: formatUptime(process.uptime())
  };

  res.status(200).json(info);
});

/**
 * @route   GET /api/stats
 * @desc    Application statistics
 * @access  Public
 */
router.get('/stats', (req, res) => {
  const stats = {
    timestamp: new Date().toISOString(),
    uptime: formatUptime(process.uptime()),
    requests: {
      // These would be populated from metrics in a real scenario
      total: 'See /api/metrics for detailed statistics',
      active: 'See /api/metrics for detailed statistics'
    },
    system: {
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
      pid: process.pid,
      platform: process.platform
    }
  };

  res.status(200).json(stats);
});

// Helper function to format uptime
function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  parts.push(`${secs}s`);

  return parts.join(' ');
}

export default router;