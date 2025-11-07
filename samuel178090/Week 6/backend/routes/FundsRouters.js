import { Router } from "express";
import * as FundServices from "../controllers/ParentControllers/FundsControllers/exports.js";
import { authenticateToken } from "../middleware/auth.js";
import { generalLimiter, transactionLimiter } from "../middleware/rateLimiter.js";
import { requestLogger } from "../middleware/logger.js";

const fundRouter = Router();

// Apply request logging to all fund routes
fundRouter.use(requestLogger);

// Cash funding routes
fundRouter.get('/cash/service-code', 
    authenticateToken,
    generalLimiter,
    FundServices.cash.getServiceCode
);

fundRouter.post('/cash/add-funds', 
    authenticateToken,
    transactionLimiter,
    // Add validation middleware when available
    FundServices.cash.addFundToUser
);

// Credit card funding routes
fundRouter.post('/credit/add-funds', 
    authenticateToken,
    transactionLimiter,
    // Add validation middleware when available
    FundServices.credit.addFundToUser
);

// Get funding history
fundRouter.get('/history',
    authenticateToken,
    generalLimiter,
    (req, res) => {
        res.status(501).json({
            error: 'Not implemented',
            message: 'Funding history endpoint not yet implemented'
        });
    }
);

// Health check for funds service
fundRouter.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        service: 'funds',
        timestamp: new Date().toISOString()
    });
});

export default fundRouter; 
