// backend/routes/taskRoutes.js
// Task management routes with RBAC

const express = require('express');
const router = express.Router();
const { authenticate, adminOnly, authenticatedOnly } = require('../middleware/auth');
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  searchTasks,
  filterTasks
} = require('../controllers/taskController');

// All task routes require authentication
router.use(authenticate);

// Task CRUD routes
router.get('/', authenticatedOnly, getTasks);           // User & Admin
router.get('/:id', authenticatedOnly, getTaskById);     // User & Admin
router.post('/', authenticatedOnly, createTask);        // User & Admin
router.put('/:id', authenticatedOnly, updateTask);      // User & Admin
router.delete('/:id', adminOnly, deleteTask);           // Admin ONLY

// Search and filter routes
router.post('/search', authenticatedOnly, searchTasks); // User & Admin
router.post('/filter', authenticatedOnly, filterTasks); // User & Admin

module.exports = router;