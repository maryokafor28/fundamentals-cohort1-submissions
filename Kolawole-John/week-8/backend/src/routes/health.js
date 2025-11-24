const express = require('express');
const router = express.Router();
const { register } = require('../config/metrics');
const os = require('os');

// Health check endpoint
router.get('/health', (req, res) => {
  const healthData = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
    system: {
      platform: os.platform(),
      arch: os.arch(),
      nodeVersion: process.version,
      memory: {
        total: `${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`,
        free: `${(os.freemem() / 1024 / 1024 / 1024).toFixed(2)} GB`,
        usage: `${(((os.totalmem() - os.freemem()) / os.totalmem()) * 100).toFixed(2)}%`,
      },
      cpus: os.cpus().length,
      loadAverage: os.loadavg(),
    },
  };

  res.json(healthData);
});

// Metrics endpoint (Prometheus format)
router.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (err) {
    res.status(500).end(err);
  }
});

// Readiness probe
router.get('/ready', (req, res) => {
  res.status(200).json({ ready: true, timestamp: new Date().toISOString() });
});

// Liveness probe
router.get('/live', (req, res) => {
  res.status(200).json({ alive: true, timestamp: new Date().toISOString() });
});

module.exports = router;