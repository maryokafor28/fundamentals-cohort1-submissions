const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // References the User model
    required: true
  },
  activityType: {
    type: String,
    required: true,
    enum: ['running', 'cycling', 'swimming', 'gym', 'yoga', 'walking', 'other']
  },
  duration: {
    type: Number, // in minutes
    required: true,
    min: [1, 'Duration must be at least 1 minute']
  },
  distance: {
    type: Number, // in kilometers
    min: 0
  },
  caloriesBurned: {
    type: Number,
    min: 0
  },
  notes: String,
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Activity', activitySchema);