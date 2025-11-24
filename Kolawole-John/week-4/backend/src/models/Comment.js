const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Comment content is required'],
    trim: true,
    maxlength: [1000, 'Comment cannot be more than 1000 characters']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  }
}, {
  timestamps: true
});

commentSchema.index({ project: 1, createdAt: -1 });
commentSchema.index({ author: 1 });

commentSchema.statics.getByProject = async function(projectId, page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  
  const [comments, total] = await Promise.all([
    this.find({ project: projectId })
      .lean()
      .populate('author', 'name email avatar')
      .select('-__v')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    this.countDocuments({ project: projectId })
  ]);

  return {
    comments,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

commentSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('Comment', commentSchema);