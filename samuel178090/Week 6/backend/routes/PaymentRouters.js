import { Router } from "express";
import { authenticateToken } from "../middleware/auth.js";
import { createPaymentIntent, getTransactionStatus } from "../controllers/ParentControllers/FundsControllers/addFunds_Credit.js";
import { transactionLimiter, generalLimiter } from "../middleware/rateLimiter.js";
import { requestLogger } from "../middleware/logger.js";

const paymentRouter = Router();

// Apply request logging to all payment routes
paymentRouter.use(requestLogger);

// All payment routes require authentication
paymentRouter.use(authenticateToken);

// Stripe payment intent creation
paymentRouter.post('/credit-card/create-intent', 
    transactionLimiter,
    // Add validation middleware when available
    createPaymentIntent
);

// Get transaction status
paymentRouter.get('/transactions/:transactionId', 
    generalLimiter,
    getTransactionStatus
);

// Webhook for payment confirmations (public endpoint)
paymentRouter.post('/webhook/stripe',
    // Remove auth for webhook
    (req, res, next) => {
        // Skip authentication for webhooks
        next();
    },
    (req, res) => {
        res.status(501).json({
            error: 'Not implemented',
            message: 'Stripe webhook endpoint not yet implemented'
        });
    }
);

// Payment methods management
paymentRouter.get('/methods',
    generalLimiter,
    (req, res) => {
        res.status(501).json({
            error: 'Not implemented',
            message: 'Payment methods endpoint not yet implemented'
        });
    }
);

// Health check for payment service
paymentRouter.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        service: 'payments',
        timestamp: new Date().toISOString()
    });
});

export default paymentRouter;