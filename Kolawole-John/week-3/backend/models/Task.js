// backend/models/Task.js
// This model defines the structure of a Task in the database

const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters'],
    index: true  // Index for faster search
  },
  
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending',
    index: true  // Index for faster filtering
  },
  
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
    index: true  // Index for faster filtering
  },
  
  // Reference to the user who created this task
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true  // Index for faster user-specific queries
  },
  
  dueDate: {
    type: Date
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
    index: true  // Index for sorting by date
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index for common queries
taskSchema.index({ createdBy: 1, status: 1 });
taskSchema.index({ createdBy: 1, createdAt: -1 });

// Update the updatedAt timestamp before saving
taskSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Task', taskSchema);