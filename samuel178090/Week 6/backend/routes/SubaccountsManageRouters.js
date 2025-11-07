import { Router } from "express";
import { authenticateToken, authorizeRole } from "../middleware/auth.js";
import * as SubaccountServices from "../controllers/ParentControllers/SubaccountControllers/exports.js";
import { generalLimiter, transactionLimiter } from "../middleware/rateLimiter.js";
import { requestLogger } from "../middleware/logger.js";

const subaccountRouter = Router();

// Apply request logging to all subaccount routes
subaccountRouter.use(requestLogger);

// All subaccount routes require authentication
subaccountRouter.use(authenticateToken);

// Create subaccount (only main users can create subaccounts)
subaccountRouter.post('/',
    authorizeRole(['USER']), // Only main users, not subaccounts
    generalLimiter,
    // Add validation middleware when available
    SubaccountServices.addSubaccount
);

// Get all subaccounts for authenticated user
subaccountRouter.get('/',
    generalLimiter,
    (req, res) => {
        res.status(501).json({
            error: 'Not implemented',
            message: 'Get all subaccounts endpoint not yet implemented'
        });
    }
);

// Get specific subaccount
subaccountRouter.get('/:id',
    generalLimiter,
    SubaccountServices.getSubaccount
);

// Update subaccount
subaccountRouter.put('/:id',
    generalLimiter,
    // Add validation middleware when available
    SubaccountServices.updateSubaccount
);

// Delete subaccount (only main users can delete)
subaccountRouter.delete('/:id',
    authorizeRole(['USER']), // Only main users, not subaccounts
    generalLimiter,
    SubaccountServices.deleteSubaccount
);

// Transfer funds to subaccount
subaccountRouter.post('/:id/transfer',
    transactionLimiter,
    // Add validation middleware when available
    (req, res) => {
        res.status(501).json({
            error: 'Not implemented',
            message: 'Subaccount transfer endpoint not yet implemented'
        });
    }
);

// Get subaccount transaction history
subaccountRouter.get('/:id/transactions',
    generalLimiter,
    (req, res) => {
        res.status(501).json({
            error: 'Not implemented',
            message: 'Subaccount transactions endpoint not yet implemented'
        });
    }
);

// Health check for subaccount service
subaccountRouter.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        service: 'subaccounts',
        timestamp: new Date().toISOString()
    });
});

export default subaccountRouter; 
