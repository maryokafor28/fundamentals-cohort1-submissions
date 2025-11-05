const express = require('express');
const { body, validationResult } = require('express-validator');
const Activity = require('../models/Activity');
const router = express.Router();

// Validation middleware
const validateActivity = [
  body('user').isMongoId().withMessage('Valid user ID is required'),
  body('title').trim().isLength({ min: 1, max: 100 }).withMessage('Title is required and must be less than 100 characters'),
  body('type').isIn([
    'running', 'walking', 'cycling', 'swimming', 'weightlifting',
    'yoga', 'pilates', 'basketball', 'football', 'tennis',
    'hiking', 'dancing', 'boxing', 'crossfit', 'rowing',
    'climbing', 'skiing', 'golf', 'volleyball', 'badminton', 'other'
  ]).withMessage('Please select a valid activity type'),
  body('duration').isFloat({ min: 1 }).withMessage('Duration must be at least 1 minute'),
  body('intensity').isIn(['low', 'moderate', 'high', 'very_high']).withMessage('Please select a valid intensity level'),
  body('activityDate').optional().isISO8601().withMessage('Please provide a valid activity date'),
  body('caloriesBurned').optional().isFloat({ min: 0 }).withMessage('Calories burned cannot be negative'),
  body('distance.value').optional().isFloat({ min: 0 }).withMessage('Distance cannot be negative')
];

const validateActivityUpdate = [
  body('title').optional().trim().isLength({ min: 1, max: 100 }).withMessage('Title must be less than 100 characters'),
  body('type').optional().isIn([
    'running', 'walking', 'cycling', 'swimming', 'weightlifting',
    'yoga', 'pilates', 'basketball', 'football', 'tennis',
    'hiking', 'dancing', 'boxing', 'crossfit', 'rowing',
    'climbing', 'skiing', 'golf', 'volleyball', 'badminton', 'other'
  ]).withMessage('Please select a valid activity type'),
  body('duration').optional().isFloat({ min: 1 }).withMessage('Duration must be at least 1 minute'),
  body('intensity').optional().isIn(['low', 'moderate', 'high', 'very_high']).withMessage('Please select a valid intensity level'),
  body('activityDate').optional().isISO8601().withMessage('Please provide a valid activity date'),
  body('caloriesBurned').optional().isFloat({ min: 0 }).withMessage('Calories burned cannot be negative'),
  body('distance.value').optional().isFloat({ min: 0 }).withMessage('Distance cannot be negative')
];

// Helper function to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// @route   GET /api/activities
// @desc    Get all activities with pagination and filtering
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const user = req.query.user;
    const type = req.query.type;
    const intensity = req.query.intensity;
    const dateFrom = req.query.dateFrom;
    const dateTo = req.query.dateTo;
    const sortBy = req.query.sortBy || 'activityDate';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    // Build query
    let query = {};
    
    if (user) {
      query.user = user;
    }
    
    if (type) {
      query.type = type;
    }
    
    if (intensity) {
      query.intensity = intensity;
    }
    
    if (dateFrom || dateTo) {
      query.activityDate = {};
      if (dateFrom) query.activityDate.$gte = new Date(dateFrom);
      if (dateTo) query.activityDate.$lte = new Date(dateTo);
    }

    const activities = await Activity.find(query)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name email profileImage');

    const total = await Activity.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: activities,
      pagination: {
        currentPage: page,
        totalPages,
        totalActivities: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching activities',
      error: error.message
    });
  }
});

// @route   GET /api/activities/:id
// @desc    Get activity by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id)
      .populate('user', 'name email profileImage height weight');
    
    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }

    res.status(200).json({
      success: true,
      data: activity
    });
  } catch (error) {
    console.error('Error fetching activity:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid activity ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error fetching activity',
      error: error.message
    });
  }
});

// @route   POST /api/activities
// @desc    Create new activity
// @access  Public
router.post('/', validateActivity, handleValidationErrors, async (req, res) => {
  try {
    const activity = new Activity(req.body);
    await activity.save();

    const populatedActivity = await Activity.findById(activity._id)
      .populate('user', 'name email profileImage');

    res.status(201).json({
      success: true,
      message: 'Activity created successfully',
      data: populatedActivity
    });
  } catch (error) {
    console.error('Error creating activity:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating activity',
      error: error.message
    });
  }
});

// @route   PUT /api/activities/:id
// @desc    Update activity
// @access  Public
router.put('/:id', validateActivityUpdate, handleValidationErrors, async (req, res) => {
  try {
    const activity = await Activity.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { 
        new: true, 
        runValidators: true 
      }
    ).populate('user', 'name email profileImage');

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Activity updated successfully',
      data: activity
    });
  } catch (error) {
    console.error('Error updating activity:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid activity ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error updating activity',
      error: error.message
    });
  }
});

// @route   DELETE /api/activities/:id
// @desc    Delete activity
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const activity = await Activity.findByIdAndDelete(req.params.id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Activity deleted successfully',
      data: activity
    });
  } catch (error) {
    console.error('Error deleting activity:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid activity ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error deleting activity',
      error: error.message
    });
  }
});

// @route   GET /api/activities/user/:userId/stats
// @desc    Get user activity statistics
// @access  Public
router.get('/user/:userId/stats', async (req, res) => {
  try {
    const userId = req.params.userId;
    const dateFrom = req.query.dateFrom;
    const dateTo = req.query.dateTo;

    // Build date query
    let dateQuery = {};
    if (dateFrom || dateTo) {
      dateQuery.activityDate = {};
      if (dateFrom) dateQuery.activityDate.$gte = new Date(dateFrom);
      if (dateTo) dateQuery.activityDate.$lte = new Date(dateTo);
    }

    const activities = await Activity.find({
      user: userId,
      ...dateQuery
    });

    if (activities.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          totalActivities: 0,
          totalDuration: 0,
          totalCalories: 0,
          averageDuration: 0,
          averageCalories: 0,
          activitiesByType: {},
          activitiesByIntensity: {},
          mostActiveDay: null
        }
      });
    }

    // Calculate statistics
    const totalActivities = activities.length;
    const totalDuration = activities.reduce((sum, activity) => sum + activity.duration, 0);
    const totalCalories = activities.reduce((sum, activity) => sum + (activity.caloriesBurned || 0), 0);
    const totalDistance = activities.reduce((sum, activity) => sum + (activity.distance?.value || 0), 0);

    // Activities by type
    const activitiesByType = activities.reduce((acc, activity) => {
      acc[activity.type] = (acc[activity.type] || 0) + 1;
      return acc;
    }, {});

    // Activities by intensity
    const activitiesByIntensity = activities.reduce((acc, activity) => {
      acc[activity.intensity] = (acc[activity.intensity] || 0) + 1;
      return acc;
    }, {});

    // Most active day of week
    const dayCount = activities.reduce((acc, activity) => {
      const day = new Date(activity.activityDate).getDay();
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const dayName = dayNames[day];
      acc[dayName] = (acc[dayName] || 0) + 1;
      return acc;
    }, {});

    const mostActiveDay = Object.keys(dayCount).reduce((a, b) => 
      dayCount[a] > dayCount[b] ? a : b, Object.keys(dayCount)[0] || null
    );

    const stats = {
      totalActivities,
      totalDuration: Math.round(totalDuration),
      totalCalories: Math.round(totalCalories),
      totalDistance: Math.round(totalDistance * 100) / 100,
      averageDuration: Math.round(totalDuration / totalActivities),
      averageCalories: Math.round(totalCalories / totalActivities),
      activitiesByType,
      activitiesByIntensity,
      mostActiveDay,
      dayCount
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching activity stats:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error fetching activity stats',
      error: error.message
    });
  }
});

// @route   GET /api/activities/types
// @desc    Get all available activity types
// @access  Public
router.get('/types', (req, res) => {
  const activityTypes = [
    'running', 'walking', 'cycling', 'swimming', 'weightlifting',
    'yoga', 'pilates', 'basketball', 'football', 'tennis',
    'hiking', 'dancing', 'boxing', 'crossfit', 'rowing',
    'climbing', 'skiing', 'golf', 'volleyball', 'badminton', 'other'
  ];

  res.status(200).json({
    success: true,
    data: activityTypes
  });
});

module.exports = router;
