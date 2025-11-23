const Comment = require('../models/Comment');
const Project = require('../models/Project');


const getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ projectId: req.params.projectId })
      .populate('userId', 'username avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments
    });
  } catch (error) {
    next(error);
  }
};


const createComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    const { projectId } = req.params;

    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const comment = await Comment.create({
      content,
      projectId,
      userId: req.user._id
    });

    const populatedComment = await Comment.findById(comment._id).populate(
      'userId',
      'username avatar'
    );

    res.status(201).json({
      success: true,
      data: populatedComment
    });
  } catch (error) {
    next(error);
  }
};


const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

   
    if (comment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this comment'
      });
    }

    await comment.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Comment removed'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getComments, createComment, deleteComment };