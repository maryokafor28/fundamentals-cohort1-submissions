const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { validateTask, validateSearch } = require('../middleware/validation');
const { rateLimitGeneral } = require('../middleware/rateLimiter');

const router = express.Router();
const prisma = new PrismaClient();

// Get all tasks (user sees only their tasks, admin sees all)
router.get('/', authenticateToken, rateLimitGeneral, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = req.user.role === 'ADMIN' ? {} : { userId: req.user.id };

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        include: {
          user: {
            select: { id: true, email: true }
          }
        },
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
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Create task
router.post('/', authenticateToken, requireRole(['USER', 'ADMIN']), rateLimitGeneral, validateTask, async (req, res) => {
  try {
    const { title, description } = req.body;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        userId: req.user.id
      },
      include: {
        user: {
          select: { id: true, email: true }
        }
      }
    });

    res.status(201).json({
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Update task
router.put('/:id', authenticateToken, requireRole(['USER', 'ADMIN']), rateLimitGeneral, validateTask, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;

    const existingTask = await prisma.task.findUnique({
      where: { id }
    });

    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Users can only update their own tasks
    if (req.user.role !== 'ADMIN' && existingTask.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const task = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        completed: completed !== undefined ? completed : existingTask.completed
      },
      include: {
        user: {
          select: { id: true, email: true }
        }
      }
    });

    res.json({
      message: 'Task updated successfully',
      task
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Delete task (Admin only)
router.delete('/:id', authenticateToken, requireRole(['ADMIN']), rateLimitGeneral, async (req, res) => {
  try {
    const { id } = req.params;

    const existingTask = await prisma.task.findUnique({
      where: { id }
    });

    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await prisma.task.delete({
      where: { id }
    });

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// Search tasks
router.post('/search', authenticateToken, requireRole(['USER', 'ADMIN']), rateLimitGeneral, validateSearch, async (req, res) => {
  try {
    const { query, page = 1, limit = 10 } = req.body;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let where = {
      OR: [
        { title: { contains: query } },
        { description: { contains: query } }
      ]
    };

    // Users can only search their own tasks
    if (req.user.role !== 'ADMIN') {
      where.userId = req.user.id;
    }

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        include: {
          user: {
            select: { id: true, email: true }
          }
        },
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
    console.error('Search tasks error:', error);
    res.status(500).json({ error: 'Failed to search tasks' });
  }
});

// Filter tasks
router.post('/filter', authenticateToken, requireRole(['USER', 'ADMIN']), rateLimitGeneral, async (req, res) => {
  try {
    const { completed, page = 1, limit = 10 } = req.body;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let where = {};

    if (completed !== undefined) {
      where.completed = completed;
    }

    // Users can only filter their own tasks
    if (req.user.role !== 'ADMIN') {
      where.userId = req.user.id;
    }

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        include: {
          user: {
            select: { id: true, email: true }
          }
        },
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
    console.error('Filter tasks error:', error);
    res.status(500).json({ error: 'Failed to filter tasks' });
  }
});

module.exports = router;