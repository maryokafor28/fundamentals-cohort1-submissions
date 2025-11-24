import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import logger from '../config/logger';
import { LegacyApiError, CacheError } from '../types';
import { ApiResponseUtil } from '../utils/apiResponse';

/**
 * Global Error Handler Middleware
 * 
 * Catches all errors and provides consistent, meaningful responses
 * Logs errors appropriately based on severity
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log error with request context
  logger.error('Error caught by error handler', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
  });

  // Handle specific error types
  if (err instanceof LegacyApiError) {
    handleLegacyApiError(err, res);
    return;
  }

  if (err instanceof CacheError) {
    handleCacheError(err, res);
    return;
  }

  // Circuit breaker errors
  if (err.message.includes('Circuit breaker')) {
    ApiResponseUtil.serviceUnavailable(res, 'Legacy API');
    return;
  }

  // Validation errors (from Joi)
  if (err.name === 'ValidationError') {
    ApiResponseUtil.badRequest(res, 'Validation failed', {
      details: err.message,
    });
    return;
  }

  // Default to internal server error
  ApiResponseUtil.error(
    res,
    'An unexpected error occurred',
    StatusCodes.INTERNAL_SERVER_ERROR,
    'INTERNAL_ERROR',
    process.env.NODE_ENV === 'development' ? { stack: err.stack } : undefined
  );
};

/**
 * Handle Legacy API specific errors
 */
function handleLegacyApiError(err: LegacyApiError, res: Response): void {
  logger.error('Legacy API Error', {
    statusCode: err.statusCode,
    code: err.code,
    details: err.details,
  });

  ApiResponseUtil.error(
    res,
    err.message,
    err.statusCode,
    err.code,
    err.details
  );
}

/**
 * Handle Cache specific errors
 */
function handleCacheError(err: CacheError, res: Response): void {
  logger.warn('Cache Error (non-critical)', {
    operation: err.operation,
    message: err.message,
  });

  // Cache errors shouldn't fail the request
  // Return success but log the issue
  ApiResponseUtil.error(
    res,
    'Cache operation failed, but request completed',
    StatusCodes.OK,
    'CACHE_WARNING',
    { operation: err.operation }
  );
}

/**
 * 404 Not Found Handler
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  logger.warn('Route not found', {
    path: req.path,
    method: req.method,
    ip: req.ip,
  });

  ApiResponseUtil.notFound(res, `Route ${req.method} ${req.path}`);
};

/**
 * Async error wrapper
 * Wraps async route handlers to catch promise rejections
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};