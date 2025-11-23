const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  activityType: {
    type: String,
    required: [true, 'Activity type is required'],
    enum: ['running', 'walking', 'cycling', 'swimming', 'gym', 'yoga', 'other']
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: [1, 'Duration must be at least 1 minute']
  },
  distance: {
    type: Number,
    min: [0, 'Distance cannot be negative']
  },
  caloriesBurned: {
    type: Number,
    min: [0, 'Calories cannot be negative']
  },
  date: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  }
}, {
  timestamps: true
});

activitySchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('Activity', activitySchema);