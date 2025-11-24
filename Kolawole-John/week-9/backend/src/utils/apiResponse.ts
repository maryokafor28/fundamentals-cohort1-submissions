import { Response } from 'express';
import { ApiResponse, PaginatedResponse } from '../types';
import { StatusCodes } from 'http-status-codes';

/**
 * Standardized API Response Utilities
 * Ensures consistent response format across all endpoints
 */

export class ApiResponseUtil {
  /**
   * Send successful response
   */
  static success<T>(
    res: Response,
    data: T,
    statusCode: number = StatusCodes.OK,
    cached: boolean = false,
    processingTime: number = 0
  ): Response {
    const response: ApiResponse<T> = {
      success: true,
      data,
      metadata: {
        timestamp: new Date().toISOString(),
        version: 'v2',
        cached,
        processingTime,
      },
    };

    return res.status(statusCode).json(response);
  }

  /**
   * Send paginated response
   */
  static paginated<T>(
    res: Response,
    data: T[],
    page: number,
    limit: number,
    total: number,
    cached: boolean = false
  ): Response {
    const response: PaginatedResponse<T> = {
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      metadata: {
        timestamp: new Date().toISOString(),
        version: 'v2',
        cached,
      },
    };

    return res.status(StatusCodes.OK).json(response);
  }

  /**
   * Send error response
   */
  static error(
    res: Response,
    message: string,
    statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR,
    code: string = 'INTERNAL_ERROR',
    details?: any
  ): Response {
    const response: ApiResponse<null> = {
      success: false,
      error: {
        code,
        message,
        details,
      },
      metadata: {
        timestamp: new Date().toISOString(),
        version: 'v2',
        cached: false,
        processingTime: 0,
      },
    };

    return res.status(statusCode).json(response);
  }

  /**
   * Send not found response
   */
  static notFound(res: Response, resource: string = 'Resource'): Response {
    return this.error(
      res,
      `${resource} not found`,
      StatusCodes.NOT_FOUND,
      'NOT_FOUND'
    );
  }

  /**
   * Send bad request response
   */
  static badRequest(res: Response, message: string, details?: any): Response {
    return this.error(
      res,
      message,
      StatusCodes.BAD_REQUEST,
      'BAD_REQUEST',
      details
    );
  }

  /**
   * Send unauthorized response
   */
  static unauthorized(res: Response, message: string = 'Unauthorized'): Response {
    return this.error(
      res,
      message,
      StatusCodes.UNAUTHORIZED,
      'UNAUTHORIZED'
    );
  }

  /**
   * Send service unavailable response (for circuit breaker)
   */
  static serviceUnavailable(
    res: Response,
    service: string = 'Service'
  ): Response {
    return this.error(
      res,
      `${service} is temporarily unavailable`,
      StatusCodes.SERVICE_UNAVAILABLE,
      'SERVICE_UNAVAILABLE',
      {
        message: 'Please try again later. The service is experiencing issues.',
        retryAfter: '60 seconds',
      }
    );
  }
}