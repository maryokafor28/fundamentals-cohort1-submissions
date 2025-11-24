import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';

/**
 * Request Logger Middleware
 * 
 * Logs all incoming requests with relevant metadata
 * Measures response time for performance monitoring
 */
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const startTime = Date.now();

  // Add response time header BEFORE response is sent
  const originalSend = res.send;
  res.send = function(data: any) {
    const duration = Date.now() - startTime;
    res.setHeader('X-Response-Time', `${duration}ms`);
    return originalSend.call(this, data);
  };

  // Log incoming request
  logger.http('Incoming request', {
    method: req.method,
    path: req.path,
    query: req.query,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });

  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    
    const logLevel = res.statusCode >= 500 ? 'error' 
      : res.statusCode >= 400 ? 'warn' 
      : 'http';

    logger.log(logLevel, 'Request completed', {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
    });
  });

  next();
};

/**
 * Performance monitoring middleware
 * Tracks slow requests
 */
export const performanceMonitor = (threshold: number = 1000) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const startTime = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - startTime;

      if (duration > threshold) {
        logger.warn('Slow request detected', {
          method: req.method,
          path: req.path,
          duration: `${duration}ms`,
          threshold: `${threshold}ms`,
        });
      }
    });

    next();
  };
};

/**
 * Request ID middleware
 * Adds unique request ID for tracing
 */
export const requestId = (req: Request, res: Response, next: NextFunction): void => {
  const id = req.get('X-Request-ID') || generateRequestId();
  req.headers['X-Request-ID'] = id;
  res.setHeader('X-Request-ID', id);
  next();
};

/**
 * Generate unique request ID
 */
function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}