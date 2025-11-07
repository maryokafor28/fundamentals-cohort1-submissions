import { Router } from "express";
import { authenticateToken } from "../middleware/auth.js";
import * as TransactionServices from "../controllers/ParentControllers/TransactionsControllers/exports.js";
import { validateTransaction, validateMoneyRequest } from "../middleware/validation.js";
import { transactionLimiter, generalLimiter } from "../middleware/rateLimiter.js";
import { requestLogger } from "../middleware/logger.js";

const transactionRouter = Router();

// Apply request logging to all transaction routes
transactionRouter.use(requestLogger);

// All transaction routes require authentication
transactionRouter.use(authenticateToken);

// Send money endpoints
transactionRouter.post('/send-money/phone',
    transactionLimiter,
    validateTransaction,
    TransactionServices.sendMoneyByPhoneNumber
);

transactionRouter.post('/send-money/username',
    transactionLimiter,
    validateTransaction,
    TransactionServices.sendMoneyByUsername
);

// Request money endpoints
transactionRouter.post('/request-money/phone',
    transactionLimiter,
    validateMoneyRequest,
    TransactionServices.requestMoneyByPhoneNumber
);

transactionRouter.post('/request-money/username',
    transactionLimiter,
    validateMoneyRequest,
    (req, res) => {
        res.status(501).json({
            error: 'Not implemented',
            message: 'Request money by username not yet implemented'
        });
    }
);

// Transaction management
transactionRouter.get('/history',
    generalLimiter,
    (req, res) => {
        res.status(501).json({
            error: 'Not implemented',
            message: 'Transaction history endpoint not yet implemented'
        });
    }
);

transactionRouter.get('/:transactionId',
    generalLimiter,
    (req, res) => {
        res.status(501).json({
            error: 'Not implemented',
            message: 'Get transaction by ID not yet implemented'
        });
    }
);

// Cancel/approve transaction requests
transactionRouter.post('/:transactionId/approve',
    transactionLimiter,
    (req, res) => {
        res.status(501).json({
            error: 'Not implemented',
            message: 'Approve transaction request not yet implemented'
        });
    }
);

transactionRouter.post('/:transactionId/cancel',
    generalLimiter,
    (req, res) => {
        res.status(501).json({
            error: 'Not implemented',
            message: 'Cancel transaction request not yet implemented'
        });
    }
);

// Health check for transaction service
transactionRouter.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        service: 'transactions',
        timestamp: new Date().toISOString()
    });
});

export default transactionRouter; 
