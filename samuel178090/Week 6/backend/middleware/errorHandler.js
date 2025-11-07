import logger from './logger.js';

export const errorHandler = (err, req, res, next) => {
    // Log error details
    logger.error('Error occurred:', {
        error: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('User-Agent')
    });

    // Validation errors
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: 'Validation failed',
            message: err.message,
            details: err.details || null
        });
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            error: 'Authentication failed',
            message: 'Invalid token provided'
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            error: 'Token expired',
            message: 'Please login again'
        });
    }

    // Prisma errors
    if (err.code === 'P2002') {
        return res.status(409).json({
            error: 'Duplicate entry',
            message: 'Resource already exists'
        });
    }

    if (err.code === 'P2025') {
        return res.status(404).json({
            error: 'Resource not found',
            message: 'The requested resource does not exist'
        });
    }

    if (err.code && err.code.startsWith('P')) {
        return res.status(400).json({
            error: 'Database error',
            message: 'A database operation failed'
        });
    }

    // Rate limiting errors
    if (err.status === 429) {
        return res.status(429).json({
            error: 'Too many requests',
            message: 'Please try again later'
        });
    }

    // Default server error
    const isDevelopment = process.env.NODE_ENV === 'development';
    res.status(err.status || 500).json({
        error: 'Internal server error',
        message: isDevelopment ? err.message : 'Something went wrong',
        ...(isDevelopment && { stack: err.stack })
    });
};

export const notFoundHandler = (req, res) => {
    res.status(404).json({
        error: 'Route not found',
        message: `Cannot ${req.method} ${req.path}`
    });
};