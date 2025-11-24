// backend/controllers/taskController.js
// Handle task CRUD operations with proper authorization

const Task = require('../models/Task');
const { validateTask, validateSearchFilter, isValidObjectId } = require('../utils/validation');

/**
 * Get all tasks
 * GET /api/tasks
 * Users: See only their tasks
 * Admins: See all tasks
 */
async function getTasks(req, res) {
  try {
    const { userId, role } = req.user;
    
    // Build query based on role
    const query = role === 'admin' ? {} : { createdBy: userId };
    
    // Get tasks with pagination - optimized
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100; // Increased default
    const skip = (page - 1) * limit;
    
    // Use lean() for faster queries
    const tasks = await Task.find(query)
      .select('title description status priority dueDate createdBy createdAt')
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();
    
    const total = await Task.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: tasks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching tasks',
      error: error.message
    });
  }
}

/**
 * Get single task by ID
 * GET /api/tasks/:id
 */
async function getTaskById(req, res) {
  try {
    const { id } = req.params;
    const { userId, role } = req.user;
    
    // Validate ObjectId format
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID format'
      });
    }
    
    const task = await Task.findById(id).populate('createdBy', 'username email');
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    // Check authorization: Users can only see their own tasks
    if (role !== 'admin' && task.createdBy._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own tasks.'
      });
    }
    
    res.status(200).json({
      success: true,
      data: task
    });
    
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching task',
      error: error.message
    });
  }
}

/**
 * Create new task
 * POST /api/tasks
 */
async function createTask(req, res) {
  try {
    const { title, description, status, priority, dueDate } = req.body;
    const { userId } = req.user;
    
    // Quick validation - removed heavy sanitization
    if (!title || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Task title is required'
      });
    }

    if (title.length > 100) {
      return res.status(400).json({
        success: false,
        message: 'Title too long (max 100 characters)'
      });
    }
    
    // Create task directly - no heavy validation
    const newTask = await Task.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      status: status || 'pending',
      priority: priority || 'medium',
      dueDate: dueDate || null,
      createdBy: userId
    });
    
    // Populate only needed fields
    const populatedTask = await Task.findById(newTask._id)
      .select('title description status priority dueDate createdBy createdAt')
      .populate('createdBy', 'username')
      .lean();
    
    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: populatedTask
    });
    
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating task',
      error: error.message
    });
  }
}

/**
 * Update task
 * PUT /api/tasks/:id
 */
async function updateTask(req, res) {
  try {
    const { id } = req.params;
    const { title, description, status, priority, dueDate } = req.body;
    const { userId, role } = req.user;
    
    // Quick validation
    if (!title || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Task title is required'
      });
    }

    // Find and check authorization
    const task = await Task.findById(id).select('createdBy').lean();
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    // Authorization check
    if (role !== 'admin' && task.createdBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only update your own tasks.'
      });
    }
    
    // Update directly
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      {
        title: title.trim(),
        description: description ? description.trim() : '',
        status: status || 'pending',
        priority: priority || 'medium',
        dueDate: dueDate || null,
        updatedAt: Date.now()
      },
      { new: true, lean: true }
    )
    .select('title description status priority dueDate createdBy createdAt updatedAt')
    .populate('createdBy', 'username');
    
    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: updatedTask
    });
    
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating task',
      error: error.message
    });
  }
}

/**
 * Delete task
 * DELETE /api/tasks/:id
 * ADMIN ONLY - This is the critical security feature!
 */
async function deleteTask(req, res) {
  try {
    const { id } = req.params;
    const { role } = req.user;
    
    // Double-check admin role (middleware should catch this, but defense in depth!)
    if (role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only admins can delete tasks.'
      });
    }
    
    // Validate ObjectId
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID format'
      });
    }
    
    const task = await Task.findByIdAndDelete(id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: { id }
    });
    
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting task',
      error: error.message
    });
  }
}

/**
 * Search tasks
 * POST /api/tasks/search
 * Search by title or description
 */
async function searchTasks(req, res) {
  try {
    const { search, page = 1, limit = 10 } = req.body;
    const { userId, role } = req.user;
    
    // Validate and sanitize
    const validation = validateSearchFilter({ search, page, limit });
    
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }
    
    // Build search query
    const searchQuery = {
      $or: [
        { title: { $regex: validation.data.search, $options: 'i' } },
        { description: { $regex: validation.data.search, $options: 'i' } }
      ]
    };
    
    // Add user filter for non-admins
    if (role !== 'admin') {
      searchQuery.createdBy = userId;
    }
    
    const skip = (validation.data.page - 1) * validation.data.limit;
    
    const tasks = await Task.find(searchQuery)
      .populate('createdBy', 'username email')
      .sort({ createdAt: -1 })
      .limit(validation.data.limit)
      .skip(skip);
    
    const total = await Task.countDocuments(searchQuery);
    
    res.status(200).json({
      success: true,
      data: tasks,
      pagination: {
        page: validation.data.page,
        limit: validation.data.limit,
        total,
        pages: Math.ceil(total / validation.data.limit)
      }
    });
    
  } catch (error) {
    console.error('Search tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while searching tasks',
      error: error.message
    });
  }
}

/**
 * Filter tasks
 * POST /api/tasks/filter
 * Filter by status, priority, date range
 */
async function filterTasks(req, res) {
  try {
    const { status, priority, page = 1, limit = 10 } = req.body;
    const { userId, role } = req.user;
    
    // Validate and sanitize
    const validation = validateSearchFilter({ status, priority, page, limit });
    
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }
    
    // Build filter query
    const filterQuery = {};
    
    if (validation.data.status) {
      filterQuery.status = validation.data.status;
    }
    
    if (validation.data.priority) {
      filterQuery.priority = validation.data.priority;
    }
    
    // Add user filter for non-admins
    if (role !== 'admin') {
      filterQuery.createdBy = userId;
    }
    
    const skip = (validation.data.page - 1) * validation.data.limit;
    
    const tasks = await Task.find(filterQuery)
      .populate('createdBy', 'username email')
      .sort({ createdAt: -1 })
      .limit(validation.data.limit)
      .skip(skip);
    
    const total = await Task.countDocuments(filterQuery);
    
    res.status(200).json({
      success: true,
      data: tasks,
      pagination: {
        page: validation.data.page,
        limit: validation.data.limit,
        total,
        pages: Math.ceil(total / validation.data.limit)
      }
    });
    
  } catch (error) {
    console.error('Filter tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while filtering tasks',
      error: error.message
    });
  }
}

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  searchTasks,
  filterTasks
};