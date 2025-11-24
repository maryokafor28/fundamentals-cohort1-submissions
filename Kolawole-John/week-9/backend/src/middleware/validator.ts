import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ApiResponseUtil } from '../utils/apiResponse';
import logger from '../config/logger';

/**
 * Validation Middleware Factory
 * 
 * Creates middleware to validate request data against Joi schemas
 * Supports validation of body, query, and params
 */
export const validate = (schema: {
  body?: Joi.ObjectSchema;
  query?: Joi.ObjectSchema;
  params?: Joi.ObjectSchema;
}) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const validationErrors: string[] = [];

    // Validate request body
    if (schema.body) {
      const { error } = schema.body.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        validationErrors.push(...error.details.map(detail => detail.message));
      }
    }

    // Validate query parameters
    if (schema.query) {
      const { error } = schema.query.validate(req.query, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        validationErrors.push(...error.details.map(detail => detail.message));
      }
    }

    // Validate URL parameters
    if (schema.params) {
      const { error } = schema.params.validate(req.params, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        validationErrors.push(...error.details.map(detail => detail.message));
      }
    }

    // Return validation errors if any
    if (validationErrors.length > 0) {
      logger.warn('Validation failed', {
        path: req.path,
        errors: validationErrors,
      });

      ApiResponseUtil.badRequest(res, 'Validation failed', {
        errors: validationErrors,
      });
      return;
    }

    next();
  };
};

/**
 * Common Validation Schemas
 */
export const commonSchemas = {
  // ID parameter validation
  id: Joi.object({
    id: Joi.number().integer().positive().required(),
  }),

  // Pagination query validation
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
  }),

  // Search query validation
  search: Joi.object({
    q: Joi.string().min(1).max(100),
    sortBy: Joi.string().valid('id', 'createdAt', 'amount', 'status'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
  }),

  // Status filter validation
  statusFilter: Joi.object({
    status: Joi.string().valid('pending', 'completed', 'failed'),
  }),

  // Cache control validation
  cacheControl: Joi.object({
    useCache: Joi.boolean().default(true),
    refresh: Joi.boolean().default(false),
  }),
};

/**
 * Payment-specific schemas
 */
export const paymentSchemas = {
  getPayments: {
    query: Joi.object({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(10),
      status: Joi.string().valid('pending', 'completed', 'failed'),
      useCache: Joi.boolean().default(true),
      refresh: Joi.boolean().default(false),
      customerId: Joi.number().integer().positive(),
    }),
  },

  getPaymentById: {
    params: commonSchemas.id,
    query: Joi.object({
      useCache: Joi.boolean().default(true),
      refresh: Joi.boolean().default(false),
    }),
  },
};

/**
 * Customer-specific schemas
 */
export const customerSchemas = {
  getCustomers: {
    query: Joi.object({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(10),
      useCache: Joi.boolean().default(true),
      refresh: Joi.boolean().default(false),
      city: Joi.string().max(100),
    }),
  },

  getCustomerById: {
    params: commonSchemas.id,
    query: Joi.object({
      useCache: Joi.boolean().default(true),
      refresh: Joi.boolean().default(false),
    }),
  },
};