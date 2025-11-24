const Project = require('../models/Project');
const Comment = require('../models/Comment');
const asyncHandler = require('../utils/asyncHandler');

// Get all projects with pagination
exports.getProjects = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const status = req.query.status;
  const search = req.query.search;

  const filter = {};
  if (status) filter.status = status;
  if (search) {
    filter.$text = { $search: search };
  }

  const result = await Project.getPaginated(page, limit, filter);

  res.status(200).json({
    status: 'success',
    data: result
  });
});

// Get single project
exports.getProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id)
    .lean()
    .populate('author', 'name email avatar bio')
    .populate('collaborators', 'name email avatar');

  if (!project) {
    return res.status(404).json({
      status: 'error',
      message: 'Project not found'
    });
  }

  const commentCount = await Comment.countDocuments({ project: project._id });

  res.status(200).json({
    status: 'success',
    data: {
      project: { ...project, commentCount }
    }
  });
});

// Create project
exports.createProject = asyncHandler(async (req, res, next) => {
  const { title, description, techStack, githubUrl, liveUrl, status, lookingForCollaborators } = req.body;

  if (!title || !description) {
    return res.status(400).json({
      status: 'error',
      message: 'Please provide title and description'
    });
  }

  const project = await Project.create({
    title,
    description,
    techStack: techStack || [],
    githubUrl,
    liveUrl,
    status,
    lookingForCollaborators,
    author: req.user._id
  });

  await project.populate('author', 'name email avatar');

  res.status(201).json({
    status: 'success',
    data: {
      project
    }
  });
});

// Update project
exports.updateProject = asyncHandler(async (req, res, next) => {
  let project = await Project.findById(req.params.id);

  if (!project) {
    return res.status(404).json({
      status: 'error',
      message: 'Project not found'
    });
  }

  if (project.author.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      status: 'error',
      message: 'Not authorized to update this project'
    });
  }

  const { title, description, techStack, githubUrl, liveUrl, status, lookingForCollaborators } = req.body;

  project = await Project.findByIdAndUpdate(
    req.params.id,
    { title, description, techStack, githubUrl, liveUrl, status, lookingForCollaborators },
    { new: true, runValidators: true }
  ).populate('author', 'name email avatar');

  res.status(200).json({
    status: 'success',
    data: {
      project
    }
  });
});

// Delete project
exports.deleteProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return res.status(404).json({
      status: 'error',
      message: 'Project not found'
    });
  }

  if (project.author.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      status: 'error',
      message: 'Not authorized to delete this project'
    });
  }

  await project.deleteOne();
  await Comment.deleteMany({ project: req.params.id });

  res.status(200).json({
    status: 'success',
    message: 'Project deleted successfully'
  });
});

// Get project comments
exports.getProjectComments = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;

  const result = await Comment.getByProject(req.params.id, page, limit);

  res.status(200).json({
    status: 'success',
    data: result
  });
});

// Add comment to project
exports.addComment = asyncHandler(async (req, res, next) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({
      status: 'error',
      message: 'Please provide comment content'
    });
  }

  const project = await Project.findById(req.params.id);
  if (!project) {
    return res.status(404).json({
      status: 'error',
      message: 'Project not found'
    });
  }

  const comment = await Comment.create({
    content,
    author: req.user._id,
    project: req.params.id
  });

  await comment.populate('author', 'name email avatar');

  res.status(201).json({
    status: 'success',
    data: {
      comment
    }
  });
});

// Delete comment
exports.deleteComment = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.commentId);

  if (!comment) {
    return res.status(404).json({
      status: 'error',
      message: 'Comment not found'
    });
  }

  if (comment.author.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      status: 'error',
      message: 'Not authorized to delete this comment'
    });
  }

  await comment.deleteOne();

  res.status(200).json({
    status: 'success',
    message: 'Comment deleted successfully'
  });
});