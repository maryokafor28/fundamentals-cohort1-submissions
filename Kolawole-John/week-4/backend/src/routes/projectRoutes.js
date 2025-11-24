const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getProjectComments,
  addComment,
  deleteComment
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');
const { createLimiter } = require('../middleware/rateLimiter');

// Project routes
router.route('/')
  .get(getProjects)
  .post(protect, createLimiter, createProject);

router.route('/:id')
  .get(getProject)
  .put(protect, updateProject)
  .delete(protect, deleteProject);

// Comment routes
router.route('/:id/comments')
  .get(getProjectComments)
  .post(protect, createLimiter, addComment);

router.delete('/:projectId/comments/:commentId', protect, deleteComment);

module.exports = router;