import { Router } from "express";
import * as VCCServices from "../controllers/ParentControllers/VirtualCreditCardsController/exports.js";
import { authenticateToken } from "../middleware/auth.js";
import { validateVCC } from "../middleware/validation.js";
import { vccLimiter, generalLimiter } from "../middleware/rateLimiter.js";
import { requestLogger } from "../middleware/logger.js";

const VCCRouter = Router();

// Apply request logging to all VCC routes
VCCRouter.use(requestLogger);

// Public routes (for external merchants)
VCCRouter.post('/use',
    generalLimiter,
    // Add validation middleware when available
    VCCServices.useCreditCard
);

// Health check for VCC service
VCCRouter.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        service: 'virtual-credit-cards',
        timestamp: new Date().toISOString()
    });
});

// All routes below require authentication
VCCRouter.use(authenticateToken);

// Generate virtual credit card
VCCRouter.post('/generate',
    vccLimiter, // Special rate limiting for VCC generation
    validateVCC,
    VCCServices.createVCC
);

// Get user's current VCC
VCCRouter.get('/current',
    generalLimiter,
    (req, res) => {
        res.status(501).json({
            error: 'Not implemented',
            message: 'Get current VCC endpoint not yet implemented'
        });
    }
);

// VCC transaction history
VCCRouter.get('/transactions',
    generalLimiter,
    (req, res) => {
        res.status(501).json({
            error: 'Not implemented',
            message: 'VCC transaction history not yet implemented'
        });
    }
);

// Deactivate VCC
VCCRouter.post('/deactivate',
    generalLimiter,
    (req, res) => {
        res.status(501).json({
            error: 'Not implemented',
            message: 'Deactivate VCC endpoint not yet implemented'
        });
    }
);

// Get VCC limits and settings
VCCRouter.get('/limits',
    generalLimiter,
    (req, res) => {
        res.status(200).json({
            success: true,
            limits: {
                maxAmount: 10000,
                maxPerHour: 3,
                validTypes: ['visa', 'mastercard', 'amex', 'jcb'],
                expirationHours: 24
            }
        });
    }
);

export default VCCRouter; 
