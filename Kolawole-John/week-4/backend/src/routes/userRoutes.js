const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');
const Project = require('../models/Project');
const asyncHandler = require('../utils/asyncHandler');

// Get user profile by ID
router.get('/:id', asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select('-password')
    .lean();

  if (!user) {
    return res.status(404).json({
      status: 'error',
      message: 'User not found'
    });
  }

  // Get user's projects
  const projects = await Project.find({ author: req.params.id })
    .lean()
    .select('title description techStack status createdAt')
    .sort({ createdAt: -1 })
    .limit(10);

  res.status(200).json({
    status: 'success',
    data: {
      user: {
        ...user,
        projectCount: projects.length,
        projects
      }
    }
  });
}));

// Update user profile (authenticated user only)
router.put('/profile', protect, asyncHandler(async (req, res) => {
  const { name, bio, skills, githubUrl, linkedinUrl } = req.body;

  const allowedUpdates = { name, bio, skills, githubUrl, linkedinUrl };
  Object.keys(allowedUpdates).forEach(
    key => allowedUpdates[key] === undefined && delete allowedUpdates[key]
  );

  const user = await User.findByIdAndUpdate(
    req.user._id,
    allowedUpdates,
    { new: true, runValidators: true }
  ).select('-password');

  res.status(200).json({
    status: 'success',
    data: { user }
  });
}));

module.exports = router;