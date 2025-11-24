const express = require('express');
const router = express.Router();

// Service status endpoint
router.get('/status', (req, res) => {
  res.json({
    success: true,
    data: {
      service: 'DeployHub Backend',
      status: 'operational',
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
    },
  });
});

// Service information
router.get('/info', (req, res) => {
  res.json({
    success: true,
    data: {
      name: 'DeployHub CI/CD Backend',
      description: 'Observability-enabled backend service with comprehensive monitoring',
      features: [
        'Health Checks',
        'Prometheus Metrics',
        'Structured Logging',
        'Error Tracking',
        'Docker Support',
        'CI/CD Pipeline',
      ],
      endpoints: {
        health: '/api/health',
        metrics: '/api/metrics',
        status: '/api/status',
        info: '/api/info',
        ready: '/api/ready',
        live: '/api/live',
      },
    },
  });
});

module.exports = router;