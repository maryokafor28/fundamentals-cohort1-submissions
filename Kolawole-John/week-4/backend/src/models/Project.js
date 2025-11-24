const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  techStack: [String],
  githubUrl: String,
  liveUrl: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,  // Reference to User
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['idea', 'in-progress', 'completed'],  // Only these values allowed
    default: 'idea',
  },
}, {
  timestamps: true,
});

// Indexes for performance
projectSchema.index({ author: 1, createdAt: -1 });  // Compound index
projectSchema.index({ createdAt: -1 });
projectSchema.index({ title: 'text', description: 'text' });  // Text search

// Static method for pagination
projectSchema.statics.getPaginated = async function(page = 1, limit = 20, filter = {}) {
  const skip = (page - 1) * limit;
  
  // Run queries in parallel for speed
  const [projects, total] = await Promise.all([
    this.find(filter)
      .lean()  // Returns plain JS objects (faster)
      .populate('author', 'name email')  // Join with User collection
      .sort({ createdAt: -1 })  // Newest first
      .skip(skip)
      .limit(limit),
    this.countDocuments(filter)
  ]);

  return {
    projects,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    }
  };
};

module.exports = mongoose.model('Project', projectSchema);