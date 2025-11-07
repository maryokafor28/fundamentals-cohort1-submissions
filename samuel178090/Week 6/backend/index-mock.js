import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { requestLogger } from './middleware/logger.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import { mockLogin, mockRegister } from './controllers/ParentControllers/Authentication/mockAuth.js';
import { validateLogin, validateUser } from './middleware/validation.js';
import { authLimiter } from './middleware/rateLimiter.js';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Security middleware - CORS Configuration (FIXED)
const allowedOrigins = [
    'http://localhost:3001',  // Current frontend port
    'http://localhost:5173',  // Vite default port
    'http://localhost:3000'   // Alternative port
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, Postman, or curl)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging and rate limiting
app.use(requestLogger);
app.use(generalLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        service: 'flowserve-api',
        version: '1.0.0',
        mode: 'mock-database',
        timestamp: new Date().toISOString() 
    });
});

// Mock authentication routes
app.post('/api/auth/login', authLimiter, validateLogin, mockLogin);
app.post('/api/auth/register', authLimiter, validateUser, mockRegister);

// Mock user routes
app.get('/api/users/profile', (req, res) => {
    res.json({
        success: true,
        user: {
            UID: 'user-123',
            firstName: 'John',
            LastName: 'Doe',
            username: 'johndoe',
            phone: '01234567890',
            email: 'john@example.com',
            balance: 1000.0
        }
    });
});

// Mock users list (no sensitive info)
app.get('/api/users', (req, res) => {
    const users = [
        {
            UID: 'user-123',
            firstName: 'John',
            LastName: 'Doe',
            username: 'johndoe',
            email: 'j***@example.com',
            phone: '012****7890',
            isActive: true,
            createdAt: new Date().toISOString()
        },
        {
            UID: 'user-456',
            firstName: 'Jane',
            LastName: 'Smith',
            username: 'janesmith',
            email: 'j***@example.com',
            phone: '019****4321',
            isActive: true,
            createdAt: new Date(Date.now() - 86400000).toISOString()
        },
        {
            UID: 'user-789',
            firstName: 'Bob',
            LastName: 'Johnson',
            username: 'bobjohnson',
            email: 'b***@example.com',
            phone: '015****3456',
            isActive: true,
            createdAt: new Date(Date.now() - 172800000).toISOString()
        },
        {
            UID: 'user-101',
            firstName: 'Alice',
            LastName: 'Wilson',
            username: 'alicewilson',
            email: 'a***@example.com',
            phone: '011****2333',
            isActive: true,
            createdAt: new Date(Date.now() - 259200000).toISOString()
        },
        {
            UID: 'user-102',
            firstName: 'Charlie',
            LastName: 'Brown',
            username: 'charliebrown',
            email: 'c***@example.com',
            phone: '014****5666',
            isActive: false,
            createdAt: new Date(Date.now() - 345600000).toISOString()
        },
        {
            UID: 'user-103',
            firstName: 'Diana',
            LastName: 'Prince',
            username: 'dianaprince',
            email: 'd***@example.com',
            phone: '017****8999',
            isActive: true,
            createdAt: new Date(Date.now() - 432000000).toISOString()
        }
    ];

    const page = parseInt(req.query.page) || 0;
    const size = parseInt(req.query.size) || 10;
    const startIndex = page * size;
    const endIndex = startIndex + size;
    
    const paginatedUsers = users.slice(startIndex, endIndex);
    
    res.json({
        success: true,
        users: paginatedUsers,
        totalUsers: users.length,
        totalPages: Math.ceil(users.length / size),
        currentPage: page
    });
});

// Mock dashboard route
app.get('/api/dashboard/data', (req, res) => {
    res.json({
        success: true,
        data: {
            user: {
                UID: 'user-123',
                firstName: 'John',
                lastName: 'Doe',
                username: 'johndoe',
                phone: '01234567890',
                email: 'john@example.com',
                balance: 1000.0
            },
            recentTransactions: [
                {
                    id: 'tx-1',
                    type: 'sent',
                    amount: 50.0,
                    status: 'COMPLETED',
                    transactionType: 'TRANSFER',
                    created_at: new Date().toISOString(),
                    counterparty: 'Jane Doe'
                },
                {
                    id: 'tx-2',
                    type: 'received',
                    amount: 100.0,
                    status: 'COMPLETED',
                    transactionType: 'TRANSFER',
                    created_at: new Date().toISOString(),
                    counterparty: 'Bob Smith'
                }
            ],
            statistics: {
                thisMonthSpent: 150.0,
                totalSent: 5,
                totalReceived: 3,
                hasActiveVCC: false
            },
            vcc: null
        }
    });
});

// Mock transaction routes
app.post('/api/transactions/send-money/phone', (req, res) => {
    res.json({
        success: true,
        message: 'Transaction completed successfully (mock)',
        transaction: {
            id: `tx-${Date.now()}`,
            amount: req.body.amount,
            status: 'COMPLETED',
            created_at: new Date().toISOString()
        }
    });
});

// Mock VCC routes
app.post('/api/vcc/generate', (req, res) => {
    res.json({
        success: true,
        message: 'Virtual credit card created successfully (mock)',
        virtualCreditCard: {
            id: `vcc-${Date.now()}`,
            cardNumber: '4111111111111111',
            amount: req.body.amount,
            creditCardType: req.body.visa_type,
            expirationDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            verificationCode: 123
        }
    });
});

// Mock payment routes
app.post('/api/payments/credit-card/create-intent', (req, res) => {
    res.json({
        success: true,
        clientSecret: `pi_mock_${Date.now()}_secret_mock`,
        paymentIntentId: `pi_mock_${Date.now()}`,
        amount: req.body.amount || 1000,
        currency: req.body.currency || 'usd'
    });
});

app.get('/api/payments/transactions/:id', (req, res) => {
    res.json({
        success: true,
        transaction: {
            id: req.params.id,
            status: 'completed',
            amount: 100.00,
            currency: 'usd',
            created: new Date().toISOString()
        }
    });
});

// Mock funds routes
app.get('/api/funds/cash/service-code', (req, res) => {
    res.json({
        success: true,
        serviceCode: 'MOCK123',
        message: 'Use this code at any Fawry location (mock)'
    });
});

app.post('/api/funds/cash/add-funds', (req, res) => {
    res.json({
        success: true,
        message: 'Funds added successfully via cash (mock)',
        amount: req.body.amount,
        newBalance: 1000 + parseFloat(req.body.amount || 0)
    });
});

app.post('/api/funds/credit/add-funds', (req, res) => {
    res.json({
        success: true,
        message: 'Funds added successfully via credit card (mock)',
        amount: req.body.amount,
        newBalance: 1000 + parseFloat(req.body.amount || 0),
        transactionId: `tx_mock_${Date.now()}`
    });
});

// Catch all other routes
app.use('/api/*', (req, res) => {
    res.status(501).json({
        error: 'Not implemented in mock mode',
        message: `${req.method} ${req.path} is not available in mock database mode`
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Route not found',
        message: `Cannot ${req.method} ${req.path}`
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// Start server
app.listen(port, () => {
    console.log(`🚀 FlowServe API server running on port ${port} (MOCK MODE)`);
    console.log(`📊 Health check: http://localhost:${port}/health`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`✅ CORS enabled for: ${allowedOrigins.join(', ')}`);
    console.log(`⚠️  Using mock database - for development only`);
    console.log(`📝 Test login: phone=01234567890, password=password123`);
});