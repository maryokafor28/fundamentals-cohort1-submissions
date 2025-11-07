import { randomBytes } from 'crypto';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import logger from './middleware/logger.js';

// Generate JWT key for development (use environment variable in production)
export const generateJWTKey = () => {
    return randomBytes(64).toString('hex');
};

// Hash password with bcrypt
export const hashPassword = async (password) => {
    try {
        if (!password) {
            throw new Error('Password is required');
        }
        
        const saltRounds = 12; // Increased for better security
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        logger.info('Password hashed successfully');
        return hashedPassword;
    } catch (error) {
        logger.error('Error hashing password', { error: error.message });
        throw error;
    }
};

// Compare password with hash
export const comparePassword = async (password, hashedPassword) => {
    try {
        if (!password || !hashedPassword) {
            throw new Error('Password and hash are required');
        }
        
        const isMatch = await bcrypt.compare(password, hashedPassword);
        logger.info('Password comparison completed', { isMatch });
        
        return isMatch;
    } catch (error) {
        logger.error('Error comparing password', { error: error.message });
        throw error;
    }
};

// Create JWT token
export const createJWT = (payload) => {
    try {
        if (!payload || !payload.id) {
            throw new Error('User ID is required for JWT creation');
        }
        
        if (!process.env.JWT_KEY) {
            throw new Error('JWT_KEY environment variable is not set');
        }
        
        const jwtExpirySeconds = 24 * 60 * 60; // 24 hours
        
        const token = jwt.sign(
            {
                id: payload.id,
                username: payload.username,
                role: payload.role || 'USER'
            },
            process.env.JWT_KEY,
            {
                expiresIn: jwtExpirySeconds,
                issuer: 'flowserve-api',
                audience: 'flowserve-client'
            }
        );
        
        logger.info('JWT token created', { userId: payload.id });
        return token;
    } catch (error) {
        logger.error('Error creating JWT token', { error: error.message });
        throw error;
    }
};

// Verify JWT token
export const verifyJWT = (token) => {
    try {
        if (!token) {
            throw new Error('Token is required');
        }
        
        if (!process.env.JWT_KEY) {
            throw new Error('JWT_KEY environment variable is not set');
        }
        
        const decoded = jwt.verify(token, process.env.JWT_KEY, {
            issuer: 'flowserve-api',
            audience: 'flowserve-client'
        });
        
        return decoded;
    } catch (error) {
        logger.error('Error verifying JWT token', { error: error.message });
        throw error;
    }
};

// Generate secure random string
export const generateSecureRandom = (length = 32) => {
    return randomBytes(length).toString('hex');
};

// Format currency
export const formatCurrency = (amount, currency = 'NGN') => {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: currency
    }).format(amount);
};

// Validate email format
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Sanitize user input
export const sanitizeInput = (input) => {
    if (typeof input !== 'string') {
        return input;
    }
    
    return input
        .trim()
        .replace(/[<>"'&]/g, (match) => {
            const entities = {
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#x27;',
                '&': '&amp;'
            };
            return entities[match];
        });
};