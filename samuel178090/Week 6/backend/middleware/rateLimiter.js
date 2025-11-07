import rateLimit from 'express-rate-limit';
import { securityLogger } from './logger.js';

// Custom handler for rate limit exceeded
const rateLimitHandler = (req, res) => {
    securityLogger('RATE_LIMIT_EXCEEDED', {
        ip: req.ip,
        url: req.url,
        method: req.method,
        userAgent: req.get('User-Agent')
    });
    
    res.status(429).json({
        error: 'Too many requests',
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter: Math.round(req.rateLimit.resetTime / 1000)
    });
};

// General API rate limiter
export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in headers
    legacyHeaders: false,
    handler: rateLimitHandler,
    skip: (req) => {
        // Skip rate limiting for health checks
        return req.url === '/health' || req.url === '/status';
    }
});

// Authentication rate limiter (stricter)
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 login attempts per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        securityLogger('AUTH_RATE_LIMIT_EXCEEDED', {
            ip: req.ip,
            url: req.url,
            userAgent: req.get('User-Agent')
        });
        
        res.status(429).json({
            error: 'Too many authentication attempts',
            message: 'Please wait 15 minutes before trying again.',
            retryAfter: Math.round(req.rateLimit.resetTime / 1000)
        });
    }
});

// Transaction rate limiter
export const transactionLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // limit each IP to 10 transactions per minute
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        securityLogger('TRANSACTION_RATE_LIMIT_EXCEEDED', {
            ip: req.ip,
            userId: req.user?.id,
            userAgent: req.get('User-Agent')
        });
        
        res.status(429).json({
            error: 'Too many transactions',
            message: 'Please wait before making another transaction.',
            retryAfter: Math.round(req.rateLimit.resetTime / 1000)
        });
    }
});

// VCC generation rate limiter (very strict)
export const vccLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // limit each IP to 3 VCC generations per hour
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        securityLogger('VCC_RATE_LIMIT_EXCEEDED', {
            ip: req.ip,
            userId: req.user?.id,
            userAgent: req.get('User-Agent')
        });
        
        res.status(429).json({
            error: 'Too many VCC generation attempts',
            message: 'Please wait 1 hour before generating another virtual credit card.',
            retryAfter: Math.round(req.rateLimit.resetTime / 1000)
        });
    }
});