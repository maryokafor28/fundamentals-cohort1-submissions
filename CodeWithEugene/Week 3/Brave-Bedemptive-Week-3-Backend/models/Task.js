const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    minlength: [1, 'Task title cannot be empty'],
    maxlength: [200, 'Task title cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Task description cannot exceed 1000 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  dueDate: {
    type: Date,
    validate: {
      validator: function(value) {
        return !value || value > Date.now();
      },
      message: 'Due date must be in the future'
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [20, 'Tag cannot exceed 20 characters']
  }],
  isDeleted: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better performance
taskSchema.index({ createdBy: 1, isDeleted: 1 });
taskSchema.index({ status: 1 });
taskSchema.index({ priority: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ title: 'text', description: 'text' });

// Pre-save middleware to update updatedAt
taskSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Instance method to check if user can access this task
taskSchema.methods.canAccess = function(userId, userRole) {
  // Admin can access all tasks
  if (userRole === 'admin') return true;
  
  // User can only access their own tasks
  return this.createdBy.toString() === userId.toString();
};

// Static method to get tasks with pagination and filtering
taskSchema.statics.getTasksWithPagination = async function(query, options = {}) {
  const {
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    userId,
    userRole
  } = options;
  
  // Build filter object
  const filter = { isDeleted: false };
  
  // Add user-specific filter for non-admin users
  if (userRole !== 'admin') {
    filter.createdBy = userId;
  }
  
  // Add search filters
  if (query.search) {
    filter.$or = [
      { title: { $regex: query.search, $options: 'i' } },
      { description: { $regex: query.search, $options: 'i' } }
    ];
  }
  
  if (query.status) {
    filter.status = query.status;
  }
  
  if (query.priority) {
    filter.priority = query.priority;
  }
  
  if (query.tags && query.tags.length > 0) {
    filter.tags = { $in: query.tags };
  }
  
  if (query.dueDateFrom || query.dueDateTo) {
    filter.dueDate = {};
    if (query.dueDateFrom) {
      filter.dueDate.$gte = new Date(query.dueDateFrom);
    }
    if (query.dueDateTo) {
      filter.dueDate.$lte = new Date(query.dueDateTo);
    }
  }
  
  // Calculate pagination
  const skip = (page - 1) * limit;
  
  // Build sort object
  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
  
  // Execute query
  const [tasks, total] = await Promise.all([
    this.find(filter)
      .populate('createdBy', 'username email')
      .populate('assignedTo', 'username email')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit)),
    this.countDocuments(filter)
  ]);
  
  return {
    tasks,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalTasks: total,
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1
    }
  };
};

module.exports = mongoose.model('Task', taskSchema);
