import Joi from 'joi';
import { securityLogger } from './logger.js';

// Helper function to handle validation errors
const handleValidationError = (error, req, res) => {
    securityLogger('VALIDATION_FAILED', {
        ip: req.ip,
        url: req.url,
        error: error.details[0].message,
        userAgent: req.get('User-Agent')
    });
    
    return res.status(400).json({
        error: 'Validation failed',
        message: error.details[0].message,
        field: error.details[0].path.join('.')
    });
};

// User registration validation
export const validateUser = (req, res, next) => {
    const schema = Joi.object({
        firstName: Joi.string()
            .min(2)
            .max(50)
            .pattern(/^[a-zA-Z\s]+$/)
            .required()
            .messages({
                'string.pattern.base': 'First name can only contain letters and spaces'
            }),
        LastName: Joi.string()
            .min(2)
            .max(50)
            .pattern(/^[a-zA-Z\s]+$/)
            .required()
            .messages({
                'string.pattern.base': 'Last name can only contain letters and spaces'
            }),
        phone: Joi.string()
            .pattern(/^[0-9]{11}$/) 
            .required()
            .messages({
                'string.pattern.base': 'Phone number must be exactly 11 digits'
            }),
        email: Joi.string()
            .email()
            .max(100)
            .required(),
        username: Joi.string()
            .min(3)
            .max(20)
            .pattern(/^[a-zA-Z0-9_]+$/)
            .required()
            .messages({
                'string.pattern.base': 'Username can only contain letters, numbers, and underscores'
            }),
        password: Joi.string()
            .min(8)
            .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/) 
            .required()
            .messages({
                'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
            }),
        nationalID: Joi.string()
            .min(10)
            .max(15)
            .pattern(/^[0-9]+$/)
            .required()
            .messages({
                'string.pattern.base': 'National ID must contain only numbers'
            }),
        birthdate: Joi.date()
            .max('now')
            .min('1900-01-01')
            .required()
    });

    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        return handleValidationError(error, req, res);
    }
    next();
};

// Transaction validation
export const validateTransaction = (req, res, next) => {
    const schema = Joi.object({
        recipientPhone: Joi.string()
            .pattern(/^[0-9]{11}$/)
            .messages({
                'string.pattern.base': 'Phone number must be exactly 11 digits'
            }),
        recipientUsername: Joi.string()
            .min(3)
            .max(20)
            .pattern(/^[a-zA-Z0-9_]+$/)
            .messages({
                'string.pattern.base': 'Username can only contain letters, numbers, and underscores'
            }),
        amount: Joi.number()
            .positive()
            .max(100000) // Maximum transaction amount
            .precision(2)
            .required()
            .messages({
                'number.max': 'Transaction amount cannot exceed 100,000'
            })
    }).or('recipientPhone', 'recipientUsername');

    const { error } = schema.validate(req.body);
    if (error) {
        return handleValidationError(error, req, res);
    }
    next();
};

// Login validation - supports both email and phone
export const validateLogin = (req, res, next) => {
    const schema = Joi.object({
        phone: Joi.string()
            .pattern(/^[0-9]{11}$/)
            .messages({
                'string.pattern.base': 'Phone number must be exactly 11 digits'
            }),
        email: Joi.string()
            .email()
            .max(100),
        password: Joi.string()
            .min(1)
            .required()
    }).or('phone', 'email');

    const { error } = schema.validate(req.body);
    if (error) {
        return handleValidationError(error, req, res);
    }
    next();
};

// VCC validation
export const validateVCC = (req, res, next) => {
    const schema = Joi.object({
        visa_type: Joi.string()
            .valid('visa', 'mastercard', 'amex', 'jcb')
            .required()
            .messages({
                'any.only': 'Visa type must be one of: visa, mastercard, amex, jcb'
            }),
        amount: Joi.number()
            .positive()
            .max(10000) // Maximum VCC amount
            .precision(2)
            .required()
            .messages({
                'number.max': 'VCC amount cannot exceed 10,000'
            })
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return handleValidationError(error, req, res);
    }
    next();
};

// Money request validation
export const validateMoneyRequest = (req, res, next) => {
    const schema = Joi.object({
        recipientPhone: Joi.string()
            .pattern(/^[0-9]{11}$/)
            .messages({
                'string.pattern.base': 'Phone number must be exactly 11 digits'
            }),
        recipientUsername: Joi.string()
            .min(3)
            .max(20)
            .pattern(/^[a-zA-Z0-9_]+$/)
            .messages({
                'string.pattern.base': 'Username can only contain letters, numbers, and underscores'
            }),
        amount: Joi.number()
            .positive()
            .max(50000) // Maximum request amount
            .precision(2)
            .required()
            .messages({
                'number.max': 'Request amount cannot exceed 50,000'
            }),
        message: Joi.string()
            .max(200)
            .optional()
    }).or('recipientPhone', 'recipientUsername');

    const { error } = schema.validate(req.body);
    if (error) {
        return handleValidationError(error, req, res);
    }
    next();
};