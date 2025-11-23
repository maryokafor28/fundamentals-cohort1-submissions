const express = require('express');
const {
  getComments,
  createComment,
  deleteComment
} = require('../controllers/commentController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router
  .route('/project/:projectId')
  .get(getComments)
  .post(protect, createComment);

router.route('/:id').delete(protect, deleteComment);

module.exports = router;