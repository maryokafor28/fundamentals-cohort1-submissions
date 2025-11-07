import { Router } from "express";
import * as UserServices from "../controllers/ParentControllers/UserControllers/exports.js";
import { authenticateToken } from "../middleware/auth.js";
import { generalLimiter } from "../middleware/rateLimiter.js";
import { requestLogger } from "../middleware/logger.js";

const userRouter = Router();

// Apply request logging to all user routes
userRouter.use(requestLogger);

// Public routes (no authentication required)
userRouter.get('/phone/:phone', 
    generalLimiter,
    UserServices.getUserByPhone
);

// Health check for user service
userRouter.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        service: 'users',
        timestamp: new Date().toISOString()
    });
});

// All routes below require authentication
userRouter.use(authenticateToken);

// User profile management
userRouter.get('/profile', 
    generalLimiter,
    UserServices.getUserById
);

userRouter.put('/profile',
    generalLimiter,
    async (req, res) => {
        try {
            const { firstName, lastName, email, phone } = req.body;
            const userId = req.user.id;
            
            // Mock profile update - replace with real database update
            res.json({
                success: true,
                message: 'Profile updated successfully',
                user: {
                    id: userId,
                    firstName,
                    lastName,
                    email,
                    phone,
                    updatedAt: new Date().toISOString()
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to update profile'
            });
        }
    }
);

// User financial data
userRouter.get('/balance',
    generalLimiter,
    (req, res) => {
        res.status(501).json({
            error: 'Not implemented',
            message: 'Get balance endpoint not yet implemented'
        });
    }
);

userRouter.get('/virtual-credit-card', 
    generalLimiter,
    UserServices.getCreditCard
);

userRouter.get('/transactions', 
    generalLimiter,
    UserServices.getTransactions
);

userRouter.get('/money-spent', 
    generalLimiter,
    UserServices.getMoneySpent
);

// User settings
userRouter.get('/settings',
    generalLimiter,
    async (req, res) => {
        try {
            const userId = req.user.id;
            
            // Mock settings - replace with real database query
            const settings = {
                notifications: {
                    email: true,
                    sms: false,
                    push: true
                },
                security: {
                    twoFactorEnabled: false,
                    loginAlerts: true
                },
                preferences: {
                    currency: 'USD',
                    language: 'en',
                    timezone: 'UTC'
                }
            };
            
            res.json({
                success: true,
                settings
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to fetch user settings'
            });
        }
    }
);

userRouter.put('/settings',
    generalLimiter,
    async (req, res) => {
        try {
            const userId = req.user.id;
            const { notifications, security, preferences } = req.body;
            
            // Mock settings update - replace with real database update
            res.json({
                success: true,
                message: 'Settings updated successfully',
                settings: {
                    notifications,
                    security,
                    preferences,
                    updatedAt: new Date().toISOString()
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to update settings'
            });
        }
    }
);

// Account management
userRouter.post('/change-password',
    generalLimiter,
    async (req, res) => {
        try {
            const { currentPassword, newPassword } = req.body;
            const userId = req.user.id;
            
            if (!currentPassword || !newPassword) {
                return res.status(400).json({
                    success: false,
                    message: 'Current password and new password are required'
                });
            }
            
            if (newPassword.length < 6) {
                return res.status(400).json({
                    success: false,
                    message: 'New password must be at least 6 characters long'
                });
            }
            
            // Mock password change - replace with real authentication logic
            res.json({
                success: true,
                message: 'Password changed successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to change password'
            });
        }
    }
);

export default userRouter; 
