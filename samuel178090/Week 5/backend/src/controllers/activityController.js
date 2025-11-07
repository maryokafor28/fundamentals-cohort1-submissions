import Activity from '../models/Activity.js';
import User from '../models/User.js';

// Get all activities
export const getActivities = async (req, res) => {
  try {
    const activities = await Activity.find().populate('user', 'name email');
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get activity by ID
export const getActivityById = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id).populate('user', 'name email');
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    res.json(activity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create activity
export const createActivity = async (req, res) => {
  try {
    const activity = new Activity(req.body);
    const savedActivity = await activity.save();
    
    // Add activity to user's activities array
    await User.findByIdAndUpdate(req.body.user, {
      $push: { activities: savedActivity._id }
    });
    
    res.status(201).json(savedActivity);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update activity
export const updateActivity = async (req, res) => {
  try {
    const activity = await Activity.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    res.json(activity);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete activity
export const deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findByIdAndDelete(req.params.id);
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    
    // Remove activity from user's activities array
    await User.findByIdAndUpdate(activity.user, {
      $pull: { activities: activity._id }
    });
    
    res.json({ message: 'Activity deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};