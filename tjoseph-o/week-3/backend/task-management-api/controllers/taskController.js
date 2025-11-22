
const Task = require('../models/Task');
const { validateObjectId } = require('../utils/validators');

async function getTasks(req, res) {
  try {
    const { userId, role } = req.user;

    let query = {};
    
    if (role !== 'admin') {
      query.userId = userId;
    }

    const tasks = await Task.find(query)
      .populate('userId', 'email role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks
    });

  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve tasks',
      error: error.message
    });
  }
}


async function createTask(req, res) {
  try {
    const { userId } = req.user;
    const { title, description, status } = req.body;

    const validStatuses = ['pending', 'in-progress', 'completed'];
    const taskStatus = status && validStatuses.includes(status) ? status : 'pending';

    const task = await Task.create({
      title,
      description,
      userId,
      status: taskStatus
    });

    await task.populate('userId', 'email role');

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task
    });

  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create task',
      error: error.message
    });
  }
}


async function updateTask(req, res) {
  try {
    const { userId, role } = req.user;
    const { id } = req.params;
    const { status } = req.body;

    if (!validateObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID format'
      });
    }

    const validStatuses = ['pending', 'in-progress', 'completed'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be: pending, in-progress, or completed'
      });
    }

   
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    if (role !== 'admin' && task.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only update your own tasks'
      });
    }

    task.status = status;
    await task.save();
    await task.populate('userId', 'email role');

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      task
    });

  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update task',
      error: error.message
    });
  }
}


async function deleteTask(req, res) {
  try {
    const { role } = req.user;
    const { id } = req.params;

    if (role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Only admins can delete tasks'
      });
    }

    if (!validateObjectId(id)) {
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
      message: 'Task deleted successfully'
    });

  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete task',
      error: error.message
    });
  }
}


async function searchTasks(req, res) {
  try {
    const { userId, role } = req.user;
    const { keyword = '', page = 1, limit = 10 } = req.body;

    let query = {};
    
    if (role !== 'admin') {
      query.userId = userId;
    }

    if (keyword && keyword.trim() !== '') {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    const totalItems = await Task.countDocuments(query);
    const tasks = await Task.find(query)
      .populate('userId', 'email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      tasks,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalItems / limit),
        totalItems,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Search tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search tasks',
      error: error.message
    });
  }
}


async function filterTasks(req, res) {
  try {
    const { userId, role } = req.user;
    const { status, page = 1, limit = 10 } = req.body;

    let query = {};
    
    if (role !== 'admin') {
      query.userId = userId;
    }

    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;
    const totalItems = await Task.countDocuments(query);
    const tasks = await Task.find(query)
      .populate('userId', 'email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      tasks,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalItems / limit),
        totalItems,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Filter tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to filter tasks',
      error: error.message
    });
  }
}

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  searchTasks,
  filterTasks
};
