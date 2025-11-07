import { Router } from "express";
import { authenticateToken, authorizeRole } from "../middleware/auth.js";
import { generalLimiter } from "../middleware/rateLimiter.js";
import { requestLogger } from "../middleware/logger.js";

const adminRouter = Router();

// Apply request logging to all admin routes
adminRouter.use(requestLogger);

// Admin authentication middleware
const authenticateAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Admin token required' });
  }
  
  // Mock admin verification - replace with real JWT verification
  if (token === 'admin-token-mock') {
    req.admin = { id: 'admin-1', email: 'admin@flowserve.com', role: 'ADMIN' };
    next();
  } else {
    res.status(403).json({ success: false, message: 'Invalid admin token' });
  }
};



// All other admin routes require admin authentication
adminRouter.use(authenticateAdmin);

// Admin Dashboard Stats
adminRouter.get('/dashboard/stats', generalLimiter, async (req, res) => {
  try {
    // Mock admin stats - replace with real database queries
    const stats = {
      totalUsers: 156,
      totalTransactions: 2847,
      totalVolume: 125430.50,
      activeVCCs: 23,
      pendingTransactions: 12,
      flaggedAccounts: 3,
      monthlyGrowth: 15.2,
      systemHealth: 'healthy'
    };

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin stats'
    });
  }
});

// Get All Users with Pagination
adminRouter.get('/users', generalLimiter, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const status = req.query.status || 'all';

    // Mock user data - replace with real database queries
    const users = [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        balance: 1250.50,
        status: 'active',
        role: 'USER',
        createdAt: '2024-01-15T10:30:00Z',
        lastLogin: '2024-01-20T14:22:00Z',
        transactionCount: 45,
        totalSpent: 2340.75
      },
      {
        id: 2,
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        phone: '+1234567891',
        balance: 890.25,
        status: 'active',
        role: 'USER',
        createdAt: '2024-01-14T09:15:00Z',
        lastLogin: '2024-01-19T16:45:00Z',
        transactionCount: 32,
        totalSpent: 1876.30
      },
      {
        id: 3,
        firstName: 'Bob',
        lastName: 'Johnson',
        email: 'bob@example.com',
        phone: '+1234567892',
        balance: 0.00,
        status: 'suspended',
        role: 'USER',
        createdAt: '2024-01-13T11:20:00Z',
        lastLogin: '2024-01-18T12:10:00Z',
        transactionCount: 8,
        totalSpent: 456.80
      }
    ];

    res.json({
      success: true,
      users,
      pagination: {
        page,
        limit,
        total: users.length,
        pages: Math.ceil(users.length / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
});

// Get User Details
adminRouter.get('/users/:id', generalLimiter, async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Mock user details - replace with real database query
    const user = {
      id: userId,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      balance: 1250.50,
      status: 'active',
      role: 'USER',
      createdAt: '2024-01-15T10:30:00Z',
      lastLogin: '2024-01-20T14:22:00Z',
      transactionCount: 45,
      totalSpent: 2340.75,
      recentTransactions: [
        {
          id: 1,
          type: 'send',
          amount: 150.00,
          recipient: 'Jane Smith',
          status: 'completed',
          createdAt: '2024-01-20T14:00:00Z'
        }
      ]
    };

    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user details'
    });
  }
});

// Update User Status
adminRouter.put('/users/:id/status', generalLimiter, async (req, res) => {
  try {
    const userId = req.params.id;
    const { status, reason } = req.body;

    if (!['active', 'suspended', 'banned'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    // Mock status update - replace with real database update
    res.json({
      success: true,
      message: `User ${status} successfully`,
      user: {
        id: userId,
        status,
        updatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update user status'
    });
  }
});

// Get All Transactions
adminRouter.get('/transactions', generalLimiter, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status || 'all';
    const type = req.query.type || 'all';

    // Mock transaction data
    const transactions = [
      {
        id: 1,
        type: 'send',
        amount: 150.00,
        sender: 'John Doe',
        recipient: 'Jane Smith',
        status: 'completed',
        createdAt: '2024-01-20T14:00:00Z',
        fee: 2.50
      },
      {
        id: 2,
        type: 'receive',
        amount: 75.50,
        sender: 'Bob Johnson',
        recipient: 'Alice Wilson',
        status: 'pending',
        createdAt: '2024-01-20T13:30:00Z',
        fee: 1.25
      }
    ];

    res.json({
      success: true,
      transactions,
      pagination: {
        page,
        limit,
        total: transactions.length,
        pages: Math.ceil(transactions.length / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transactions'
    });
  }
});

// System Health Check
adminRouter.get('/system/health', generalLimiter, async (req, res) => {
  try {
    const health = {
      status: 'healthy',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      timestamp: new Date().toISOString(),
      services: {
        database: 'healthy',
        redis: 'healthy',
        stripe: 'healthy',
        fawry: 'healthy'
      }
    };

    res.json({
      success: true,
      health
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to check system health'
    });
  }
});

// Generate Reports
adminRouter.post('/reports/generate', generalLimiter, async (req, res) => {
  try {
    const { type, dateRange, format } = req.body;

    // Mock report generation
    const report = {
      id: Date.now(),
      type,
      dateRange,
      format,
      status: 'generating',
      createdAt: new Date().toISOString(),
      downloadUrl: null
    };

    // Simulate report generation
    setTimeout(() => {
      report.status = 'completed';
      report.downloadUrl = `/api/admin/reports/${report.id}/download`;
    }, 3000);

    res.json({
      success: true,
      report
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate report'
    });
  }
});

// Health check for admin service
adminRouter.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'admin',
    timestamp: new Date().toISOString()
  });
});

export default adminRouter;