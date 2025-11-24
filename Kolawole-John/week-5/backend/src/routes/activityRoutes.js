const express = require('express');
const router = express.Router();
const {
  getAllActivities,
  getActivitiesByUser,
  createActivity,
  updateActivity,
  deleteActivity
} = require('../controllers/activityController');

router.route('/')
  .get(getAllActivities)
  .post(createActivity);

router.route('/:id')
  .put(updateActivity)
  .delete(deleteActivity);

// Special route for user's activities
router.get('/user/:userId', getActivitiesByUser);

module.exports = router;