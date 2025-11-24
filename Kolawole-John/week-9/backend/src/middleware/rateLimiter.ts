import rateLimit from 'express-rate-limit';
import config from '../config';
import logger from '../config/logger';
import { ApiResponseUtil } from '../utils/apiResponse';
import { Request, Response } from 'express';

/**
 * Rate Limiting Middleware
 * 
 * Protects API from abuse and ensures fair usage
 * Implements sliding window rate limiting
 */

// Standard rate limiter for most endpoints
export const standardLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  handler: (req: Request, res: Response) => {
    logger.warn('Rate limit exceeded', {
      ip: req.ip,
      path: req.path,
    });

    ApiResponseUtil.error(
      res,
      'Too many requests from this IP, please try again later',
      429,
      'RATE_LIMIT_EXCEEDED',
      {
        retryAfter: `${config.rateLimit.windowMs / 1000} seconds`,
      }
    );
  },
  // Skip rate limiting in test environment
  skip: () => process.env.NODE_ENV === 'test',
});

// Strict rate limiter for sensitive endpoints
export const strictLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: Math.floor(config.rateLimit.max / 2), // Half the standard limit
  message: 'Too many requests to sensitive endpoint.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    logger.error('Strict rate limit exceeded', {
      ip: req.ip,
      path: req.path,
    });

    ApiResponseUtil.error(
      res,
      'Too many requests to sensitive endpoint',
      429,
      'STRICT_RATE_LIMIT_EXCEEDED',
      {
        retryAfter: `${config.rateLimit.windowMs / 1000} seconds`,
      }
    );
  },
  skip: () => process.env.NODE_ENV === 'test',
});

// Lenient rate limiter for public endpoints
export const publicLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max * 2, // Double the standard limit
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === 'test',
});

/**
 * Custom rate limiter factory
 * Allows creation of custom rate limiters
 */
export const createCustomLimiter = (windowMs: number, max: number) => {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => process.env.NODE_ENV === 'test',
  });
};