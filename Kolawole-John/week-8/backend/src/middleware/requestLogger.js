const logger = require('../config/logger');
const { httpRequestDuration, httpRequestTotal, activeConnections } = require('../config/metrics');

const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  
  activeConnections.inc();
  
  // Log request
  logger.info({
    type: 'request',
    method: req.method,
    url: req.url,
    ip: req.ip,
  });

  // Capture response
  res.on('finish', () => {
    const duration = (Date.now() - startTime) / 1000;
    
    activeConnections.dec();
    
    // Record metrics
    httpRequestDuration
      .labels(req.method, req.route?.path || req.url, res.statusCode)
      .observe(duration);
    
    httpRequestTotal
      .labels(req.method, req.route?.path || req.url, res.statusCode)
      .inc();
    
    // Log response
    logger.info({
      type: 'response',
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}s`,
    });
  });

  next();
};

module.exports = requestLogger;