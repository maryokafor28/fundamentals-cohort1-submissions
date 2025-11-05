const express = require('express');
const Task = require('../models/Task');
const { 
  validateTaskTitle, 
  validateTaskDescription, 
  validateTaskStatus, 
  validateTaskPriority, 
  validateDate, 
  validateTags,
  validatePagination,
  validateSort,
  validateSearchQuery,
  validateObjectId
} = require('../utils/validation');
const { authenticate, requireUserOrAdmin, requireAdmin, authorizeTaskAccess } = require('../middleware/auth');
const { AppError } = require('../middleware/errorHandler');

const router = express.Router();

/**
 * @route   GET /api/tasks
 * @desc    Get all tasks (with pagination and filtering)
 * @access  Private (User/Admin)
 */
router.get('/', authenticate, requireUserOrAdmin, async (req, res, next) => {
  try {
    const { page, limit } = validatePagination(req.query);
    const { sortBy, sortOrder } = validateSort(req.query);
    
    const options = {
      page,
      limit,
      sortBy,
      sortOrder,
      userId: req.user.id,
      userRole: req.user.role
    };
    
    const result = await Task.getTasksWithPagination(req.query, options);
    
    res.json({
      success: true,
      data: result.tasks,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/tasks/:id
 * @desc    Get a specific task
 * @access  Private (User/Admin)
 */
router.get('/:id', authenticate, requireUserOrAdmin, authorizeTaskAccess, async (req, res, next) => {
  try {
    const taskId = validateObjectId(req.params.id);
    
    const task = await Task.findById(taskId)
      .populate('createdBy', 'username email')
      .populate('assignedTo', 'username email');
    
    if (!task || task.isDeleted) {
      throw new AppError('Task not found', 404, 'TASK_NOT_FOUND');
    }
    
    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/tasks
 * @desc    Create a new task
 * @access  Private (User/Admin)
 */
router.post('/', authenticate, requireUserOrAdmin, async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate, tags, assignedTo } = req.body;
    
    // Validate required fields
    if (!title) {
      throw new AppError('Task title is required', 400, 'MISSING_TITLE');
    }
    
    // Sanitize and validate inputs
    const taskData = {
      title: validateTaskTitle(title),
      description: validateTaskDescription(description),
      status: status ? validateTaskStatus(status) : 'pending',
      priority: priority ? validateTaskPriority(priority) : 'medium',
      dueDate: dueDate ? validateDate(dueDate) : null,
      tags: validateTags(tags),
      createdBy: req.user.id
    };
    
    // Validate assignedTo if provided
    if (assignedTo) {
      taskData.assignedTo = validateObjectId(assignedTo);
    }
    
    // Create new task
    const task = new Task(taskData);
    await task.save();
    
    // Populate the created task
    await task.populate([
      { path: 'createdBy', select: 'username email' },
      { path: 'assignedTo', select: 'username email' }
    ]);
    
    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   PUT /api/tasks/:id
 * @desc    Update a task
 * @access  Private (User/Admin)
 */
router.put('/:id', authenticate, requireUserOrAdmin, authorizeTaskAccess, async (req, res, next) => {
  try {
    const taskId = validateObjectId(req.params.id);
    const { title, description, status, priority, dueDate, tags, assignedTo } = req.body;
    
    // Build update data
    const updateData = {};
    
    if (title !== undefined) {
      updateData.title = validateTaskTitle(title);
    }
    
    if (description !== undefined) {
      updateData.description = validateTaskDescription(description);
    }
    
    if (status !== undefined) {
      updateData.status = validateTaskStatus(status);
    }
    
    if (priority !== undefined) {
      updateData.priority = validateTaskPriority(priority);
    }
    
    if (dueDate !== undefined) {
      updateData.dueDate = dueDate ? validateDate(dueDate) : null;
    }
    
    if (tags !== undefined) {
      updateData.tags = validateTags(tags);
    }
    
    if (assignedTo !== undefined) {
      updateData.assignedTo = assignedTo ? validateObjectId(assignedTo) : null;
    }
    
    // Update task
    const task = await Task.findByIdAndUpdate(
      taskId,
      updateData,
      { new: true, runValidators: true }
    ).populate([
      { path: 'createdBy', select: 'username email' },
      { path: 'assignedTo', select: 'username email' }
    ]);
    
    if (!task) {
      throw new AppError('Task not found', 404, 'TASK_NOT_FOUND');
    }
    
    res.json({
      success: true,
      message: 'Task updated successfully',
      data: task
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete a task (Admin only)
 * @access  Private (Admin only)
 */
router.delete('/:id', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const taskId = validateObjectId(req.params.id);
    
    const task = await Task.findByIdAndUpdate(
      taskId,
      { isDeleted: true },
      { new: true }
    );
    
    if (!task) {
      throw new AppError('Task not found', 404, 'TASK_NOT_FOUND');
    }
    
    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/tasks/search
 * @desc    Search tasks with advanced filtering
 * @access  Private (User/Admin)
 */
router.post('/search', authenticate, requireUserOrAdmin, async (req, res, next) => {
  try {
    const { query, filters, pagination, sort } = req.body;
    
    // Validate pagination
    const { page, limit } = validatePagination(pagination || {});
    const { sortBy, sortOrder } = validateSort(sort || {});
    
    // Build search query
    const searchQuery = {};
    
    // Add search term
    if (query && query.search) {
      const searchTerm = validateSearchQuery(query.search);
      if (searchTerm) {
        searchQuery.$or = [
          { title: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } }
        ];
      }
    }
    
    // Add filters
    if (filters) {
      if (filters.status) {
        searchQuery.status = validateTaskStatus(filters.status);
      }
      
      if (filters.priority) {
        searchQuery.priority = validateTaskPriority(filters.priority);
      }
      
      if (filters.tags && Array.isArray(filters.tags)) {
        searchQuery.tags = { $in: validateTags(filters.tags) };
      }
      
      if (filters.dueDateFrom || filters.dueDateTo) {
        searchQuery.dueDate = {};
        if (filters.dueDateFrom) {
          searchQuery.dueDate.$gte = validateDate(filters.dueDateFrom);
        }
        if (filters.dueDateTo) {
          searchQuery.dueDate.$lte = validateDate(filters.dueDateTo);
        }
      }
    }
    
    const options = {
      page,
      limit,
      sortBy,
      sortOrder,
      userId: req.user.id,
      userRole: req.user.role
    };
    
    const result = await Task.getTasksWithPagination(searchQuery, options);
    
    res.json({
      success: true,
      data: result.tasks,
      pagination: result.pagination,
      searchQuery: {
        query: query?.search || '',
        filters: filters || {}
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/tasks/filter
 * @desc    Filter tasks by various criteria
 * @access  Private (User/Admin)
 */
router.post('/filter', authenticate, requireUserOrAdmin, async (req, res, next) => {
  try {
    const { status, priority, tags, dueDateFrom, dueDateTo, assignedTo } = req.body;
    const { page, limit } = validatePagination(req.query);
    const { sortBy, sortOrder } = validateSort(req.query);
    
    // Build filter query
    const filterQuery = {};
    
    if (status) {
      filterQuery.status = validateTaskStatus(status);
    }
    
    if (priority) {
      filterQuery.priority = validateTaskPriority(priority);
    }
    
    if (tags && Array.isArray(tags)) {
      filterQuery.tags = { $in: validateTags(tags) };
    }
    
    if (dueDateFrom || dueDateTo) {
      filterQuery.dueDate = {};
      if (dueDateFrom) {
        filterQuery.dueDate.$gte = validateDate(dueDateFrom);
      }
      if (dueDateTo) {
        filterQuery.dueDate.$lte = validateDate(dueDateTo);
      }
    }
    
    if (assignedTo) {
      filterQuery.assignedTo = validateObjectId(assignedTo);
    }
    
    const options = {
      page,
      limit,
      sortBy,
      sortOrder,
      userId: req.user.id,
      userRole: req.user.role
    };
    
    const result = await Task.getTasksWithPagination(filterQuery, options);
    
    res.json({
      success: true,
      data: result.tasks,
      pagination: result.pagination,
      filters: {
        status: status || null,
        priority: priority || null,
        tags: tags || [],
        dueDateFrom: dueDateFrom || null,
        dueDateTo: dueDateTo || null,
        assignedTo: assignedTo || null
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/tasks/stats/overview
 * @desc    Get task statistics overview
 * @access  Private (User/Admin)
 */
router.get('/stats/overview', authenticate, requireUserOrAdmin, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    
    // Build base filter
    const baseFilter = { isDeleted: false };
    if (userRole !== 'admin') {
      baseFilter.createdBy = userId;
    }
    
    // Get task counts by status
    const statusStats = await Task.aggregate([
      { $match: baseFilter },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    // Get task counts by priority
    const priorityStats = await Task.aggregate([
      { $match: baseFilter },
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);
    
    // Get total task count
    const totalTasks = await Task.countDocuments(baseFilter);
    
    // Get overdue tasks
    const overdueTasks = await Task.countDocuments({
      ...baseFilter,
      dueDate: { $lt: new Date() },
      status: { $ne: 'completed' }
    });
    
    res.json({
      success: true,
      data: {
        totalTasks,
        overdueTasks,
        statusBreakdown: statusStats.reduce((acc, stat) => {
          acc[stat._id] = stat.count;
          return acc;
        }, {}),
        priorityBreakdown: priorityStats.reduce((acc, stat) => {
          acc[stat._id] = stat.count;
          return acc;
        }, {})
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
