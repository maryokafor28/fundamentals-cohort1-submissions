const express = require('express');
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject
} = require('../controllers/projectController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/').get(getProjects).post(protect, createProject);

router
  .route('/:id')
  .get(getProject)
  .put(protect, updateProject)
  .delete(protect, deleteProject);

module.exports = router;