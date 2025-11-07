require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Add this import
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// CORS configuration - MUST come before other middleware
app.use(cors({
  origin: ['https://taskassig.netlify.app', 'http://localhost:5173', 'http://localhost:3000'], // Add your frontend URLs
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json());

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str.replace(/[<>"'&]/g, (match) => {
    const entities = { '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '&': '&amp;' };
    return entities[match];
  }).trim();
};

const authenticateToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access token required' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, role: true, isLocked: true, lockUntil: true }
    });
    
    if (!user) return res.status(401).json({ error: 'User not found' });
    if (user.isLocked && user.lockUntil && new Date() < user.lockUntil) {
      return res.status(423).json({ error: 'Account locked' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

const requireRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }
  next();
};

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    
    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    
    if (password.length < 8 || !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return res.status(400).json({ error: 'Password must be 8+ chars with uppercase, lowercase, and number' });
    }
    
    const cleanEmail = sanitizeString(email.toLowerCase());
    const existingUser = await prisma.user.findUnique({ where: { email: cleanEmail } });
    
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { email: cleanEmail, password: hashedPassword, role: 'USER' },
      select: { id: true, email: true, role: true }
    });
    
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password || !validateEmail(email)) {
      return res.status(400).json({ error: 'Valid email and password required' });
    }
    
    const user = await prisma.user.findUnique({ where: { email: sanitizeString(email.toLowerCase()) } });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    if (user.isLocked && user.lockUntil && new Date() < user.lockUntil) {
      const remainingTime = Math.ceil((user.lockUntil - new Date()) / 1000 / 60);
      return res.status(423).json({ error: `Account locked for ${remainingTime} minutes` });
    }
    
    if (user.isLocked && user.lockUntil && new Date() >= user.lockUntil) {
      await prisma.user.update({
        where: { id: user.id },
        data: { isLocked: false, lockUntil: null, failedAttempts: 0 }
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
        return res.status(423).json({ error: 'Account locked due to failed attempts. Try again in 30 minutes.' });
      }
      
      return res.status(401).json({ error: 'Invalid credentials', attemptsRemaining: 3 - failedAttempts });
    }
    
    if (user.failedAttempts > 0) {
      await prisma.user.update({
        where: { id: user.id },
        data: { failedAttempts: 0, isLocked: false, lockUntil: null }
      });
    }
    
    const { accessToken, refreshToken } = generateTokens(user.id);
    
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });
    
    res.json({
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.post('/api/auth/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' });
    }
    
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken }
    });
    
    if (!storedToken || storedToken.expiresAt < new Date()) {
      if (storedToken) await prisma.refreshToken.delete({ where: { id: storedToken.id } });
      return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }
    
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(storedToken.userId);
    
    await prisma.refreshToken.delete({ where: { id: storedToken.id } });
    await prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: storedToken.userId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });
    
    res.json({ accessToken, refreshToken: newRefreshToken });
  } catch (error) {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});

app.post('/api/auth/logout', authenticateToken, async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      await prisma.refreshToken.deleteMany({
        where: { token: refreshToken, userId: req.user.id }
      });
    }
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Logout failed' });
  }
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

app.get('/api/tasks', authenticateToken, requireRole(['USER', 'ADMIN']), async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where = req.user.role === 'ADMIN' ? {} : { userId: req.user.id };
    
    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        include: { user: { select: { id: true, email: true } } },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.task.count({ where })
    ]);
    
    res.json({
      tasks,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

app.post('/api/tasks', authenticateToken, requireRole(['USER', 'ADMIN']), async (req, res) => {
  try {
    const { title, description } = req.body;
    
    if (!title || title.trim().length === 0) {
      return res.status(400).json({ error: 'Task title is required' });
    }
    
    const task = await prisma.task.create({
      data: {
        title: sanitizeString(title),
        description: description ? sanitizeString(description) : null,
        userId: req.user.id
      },
      include: { user: { select: { id: true, email: true } } }
    });
    
    res.status(201).json({ message: 'Task created successfully', task });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

app.delete('/api/tasks/:id', authenticateToken, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    await prisma.task.delete({ where: { id } });
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

app.put('/api/tasks/:id', authenticateToken, requireRole(['USER', 'ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;
    
    const existingTask = await prisma.task.findUnique({ where: { id } });
    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    if (req.user.role !== 'ADMIN' && existingTask.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const task = await prisma.task.update({
      where: { id },
      data: {
        title: title ? sanitizeString(title) : existingTask.title,
        description: description !== undefined ? (description ? sanitizeString(description) : null) : existingTask.description,
        completed: completed !== undefined ? completed : existingTask.completed
      },
      include: { user: { select: { id: true, email: true } } }
    });
    
    res.json({ message: 'Task updated successfully', task });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

app.post('/api/tasks/search', authenticateToken, requireRole(['USER', 'ADMIN']), async (req, res) => {
  try {
    const { query, page = 1, limit = 10 } = req.body;
    
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Search query required' });
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const searchQuery = sanitizeString(query);
    
    let where = {
      OR: [
        { title: { contains: searchQuery } },
        { description: { contains: searchQuery } }
      ]
    };
    
    if (req.user.role !== 'ADMIN') {
      where.userId = req.user.id;
    }
    
    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        include: { user: { select: { id: true, email: true } } },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.task.count({ where })
    ]);
    
    res.json({
      tasks,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
});

app.post('/api/tasks/filter', authenticateToken, requireRole(['USER', 'ADMIN']), async (req, res) => {
  try {
    const { completed, page = 1, limit = 10 } = req.body;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    let where = {};
    if (completed !== undefined) {
      where.completed = completed;
    }
    
    if (req.user.role !== 'ADMIN') {
      where.userId = req.user.id;
    }
    
    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        include: { user: { select: { id: true, email: true } } },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.task.count({ where })
    ]);
    
    res.json({
      tasks,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Filter failed' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});