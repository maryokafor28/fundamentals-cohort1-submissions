import { Router } from "express";
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { validateUser, validateLogin } from "../middleware/validation.js";
import { authLimiter, generalLimiter } from "../middleware/rateLimiter.js";
import { requestLogger } from "../middleware/logger.js";

// Try to import real auth service, fallback to mock
let AuthenticationService;
try {
    AuthenticationService = await import("../controllers/ParentControllers/Authentication/exports.js");
} catch (error) {
    console.log('Using mock authentication service');
    AuthenticationService = await import("../controllers/ParentControllers/Authentication/mockAuth.js");
}

const AuthRouter = Router();

// Ensure upload directory exists
const uploadDir = './uploads/NationalIDs';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Enhanced multer configuration
const storageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === "image") {
            cb(null, uploadDir);
        } else {
            cb(new Error('Invalid field name'), null);
        }
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `nationalid-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage: storageEngine,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
        files: 1
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, JPG, PNG, and WebP are allowed.'), false);
        }
    }
});

// Apply request logging to all auth routes
AuthRouter.use(requestLogger);

// Registration endpoint
AuthRouter.post('/register', 
    authLimiter,
    upload.single('image'),
    validateUser,
    async (req, res) => {
        try {
            const { firstName, lastName, email, phone, password } = req.body;
            
            // Mock registration
            res.json({
                success: true,
                message: 'Registration successful',
                user: {
                    id: `user-${Date.now()}`,
                    firstName,
                    lastName,
                    email,
                    phone,
                    role: 'USER'
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Registration failed' });
        }
    }
);

// Login endpoint
AuthRouter.post('/login', 
    authLimiter,
    validateLogin,
    async (req, res) => {
        try {
            const { email, password } = req.body;
            
            // Mock user credentials
            const users = [
                { id: 'user-1', email: 'john.doe@example.com', password: 'password123', firstName: 'John', lastName: 'Doe' },
                { id: 'user-2', email: 'jane.smith@example.com', password: 'password123', firstName: 'Jane', lastName: 'Smith' },
                { id: 'user-3', email: 'bob.johnson@example.com', password: 'password123', firstName: 'Bob', lastName: 'Johnson' }
            ];
            
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                res.json({
                    success: true,
                    token: `user-token-${user.id}`,
                    user: {
                        id: user.id,
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        role: 'USER'
                    }
                });
            } else {
                res.status(401).json({ success: false, message: 'Invalid credentials' });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: 'Login failed' });
        }
    }
);

// Password reset request (if implemented)
AuthRouter.post('/forgot-password',
    generalLimiter,
    // Add validation middleware when implemented
    (req, res) => {
        res.status(501).json({ 
            error: 'Not implemented',
            message: 'Password reset functionality not yet implemented'
        });
    }
);

// Admin login endpoint
AuthRouter.post('/admin-login', 
    authLimiter,
    async (req, res) => {
        try {
            const { email, password } = req.body;
            
            // Mock admin credentials
            if (email === 'admin@flowserve.com' && password === 'admin123') {
                res.json({
                    success: true,
                    token: 'admin-token-mock',
                    admin: {
                        id: 'admin-1',
                        email: 'admin@flowserve.com',
                        role: 'ADMIN',
                        name: 'System Administrator'
                    }
                });
            } else {
                res.status(401).json({ success: false, message: 'Invalid admin credentials' });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: 'Admin login failed' });
        }
    }
);

// Health check for auth service
AuthRouter.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'healthy',
        service: 'authentication',
        timestamp: new Date().toISOString()
    });
});

export default AuthRouter; 