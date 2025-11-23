



const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const { validateTask } = require('../middleware/validate');
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  searchTasks,
  filterTasks
} = require('../controllers/taskController');


router.get('/', authenticate, authorize(['user', 'admin']), getTasks);


router.post('/', authenticate, authorize(['user', 'admin']), validateTask, createTask);


router.put('/:id', authenticate, authorize(['user', 'admin']), updateTask);


router.delete('/:id', authenticate, authorize(['admin']), deleteTask);


router.post('/search', authenticate, authorize(['user', 'admin']), searchTasks);


router.post('/filter', authenticate, authorize(['user', 'admin']), filterTasks);

module.exports = router;


router.get('/', authenticate, authorize(['user', 'admin']), getTasks);


router.post('/', authenticate, authorize(['user', 'admin']), validateTask, createTask);


router.delete('/:id', authenticate, authorize(['admin']), deleteTask);


router.post('/search', authenticate, authorize(['user', 'admin']), searchTasks);


router.post('/filter', authenticate, authorize(['user', 'admin']), filterTasks);

module.exports = router;