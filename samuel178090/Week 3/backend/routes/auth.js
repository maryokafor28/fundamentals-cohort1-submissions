const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { validateRegistration, validateLogin } = require('../middleware/validation');
const { rateLimitLogin, rateLimitGeneral } = require('../middleware/rateLimiter');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN }
  );

  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
  );

  return { accessToken, refreshToken };
};

// Register
router.post('/register', rateLimitGeneral, validateRegistration, async (req, res) => {
  try {
    const { email, password, role = 'USER' } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Only allow USER registration for public endpoint
    // Admin registration requires existing admin authentication
    const userRole = 'USER';

    const hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS));

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: userRole
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    res.status(201).json({
      message: 'User registered successfully',
      user
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Admin-only endpoint to create admin users
router.post('/create-admin', authenticateToken, async (req, res) => {
  try {
    // Only existing admins can create new admins
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Only admins can create admin accounts' });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS));

    const adminUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'ADMIN'
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    res.status(201).json({
      message: 'Admin user created successfully',
      user: adminUser
    });
  } catch (error) {
    console.error('Admin creation error:', error);
    res.status(500).json({ error: 'Failed to create admin user' });
  }
});

// TEMPORARY: Remove after creating first admin in production
router.post('/create-first-admin', async (req, res) => {
  try {
    const adminEmail = 'admin@example.com';
    const adminPassword = 'Admin123456';

    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail }
    });

    if (existingAdmin) {
      return res.status(409).json({ error: 'Admin already exists' });
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        role: 'ADMIN'
      }
    });

    res.json({ 
      message: 'Admin created successfully', 
      email: adminEmail,
      note: 'REMOVE THIS ENDPOINT IMMEDIATELY FOR SECURITY'
    });
  } catch (error) {
    console.error('Admin creation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', rateLimitLogin, validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if account is locked
    if (user.isLocked && user.lockUntil && new Date() < user.lockUntil) {
      const remainingTime = Math.ceil((user.lockUntil - new Date()) / 1000 / 60);
      return res.status(423).json({ 
        error: 'Account locked',
        remainingTime: `${remainingTime} minutes`
      });
    }

    // Auto-unlock if lock period expired
    if (user.isLocked && user.lockUntil && new Date() >= user.lockUntil) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          isLocked: false,
          lockUntil: null,
          failedAttempts: 0
        }
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      const failedAttempts = user.failedAttempts + 1;
      const shouldLock = failedAttempts >= 3;

      await prisma.user.update({
        where: { id: user.id },
        data: {
          failedAttempts,
          isLocked: shouldLock,
          lockUntil: shouldLock ? new Date(Date.now() + 30 * 60 * 1000) : null
        }
      });

      if (shouldLock) {
        return res.status(423).json({ 
          error: 'Account locked due to failed attempts. Try again in 30 minutes.'
        });
      }

      return res.status(401).json({ 
        error: 'Invalid credentials',
        attemptsRemaining: 3 - failedAttempts
      });
    }

    // Reset failed attempts on successful login
    if (user.failedAttempts > 0) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          failedAttempts: 0,
          isLocked: false,
          lockUntil: null
        }
      });
    }

    const { accessToken, refreshToken } = generateTokens(user.id);

    // Store refresh token
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt
      }
    });

    res.json({
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Refresh token
router.post('/refresh', rateLimitGeneral, async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' });
    }

    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true }
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      if (storedToken) {
        await prisma.refreshToken.delete({
          where: { id: storedToken.id }
        });
      }
      return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }

    try {
      jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
      await prisma.refreshToken.delete({
        where: { id: storedToken.id }
      });
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(storedToken.userId);

    // Replace old refresh token
    await prisma.refreshToken.delete({
      where: { id: storedToken.id }
    });

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: storedToken.userId,
        expiresAt
      }
    });

    res.json({
      accessToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({ error: 'Token refresh failed' });
  }
});

// Logout
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      await prisma.refreshToken.deleteMany({
        where: {
          token: refreshToken,
          userId: req.user.id
        }
      });
    }

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
});

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role
    }
  });
});

module.exports = router;