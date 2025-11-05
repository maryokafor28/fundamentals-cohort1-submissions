const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  title: {
    type: String,
    required: [true, 'Activity title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  type: {
    type: String,
    required: [true, 'Activity type is required'],
    enum: [
      'running', 'walking', 'cycling', 'swimming', 'weightlifting',
      'yoga', 'pilates', 'basketball', 'football', 'tennis',
      'hiking', 'dancing', 'boxing', 'crossfit', 'rowing',
      'climbing', 'skiing', 'golf', 'volleyball', 'badminton',
      'other'
    ]
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: [1, 'Duration must be at least 1 minute']
  },
  intensity: {
    type: String,
    enum: ['low', 'moderate', 'high', 'very_high'],
    required: [true, 'Intensity is required']
  },
  caloriesBurned: {
    type: Number,
    min: [0, 'Calories burned cannot be negative'],
    default: 0
  },
  distance: {
    value: {
      type: Number,
      min: [0, 'Distance cannot be negative']
    },
    unit: {
      type: String,
      enum: ['km', 'miles', 'meters'],
      default: 'km'
    }
  },
  heartRate: {
    average: {
      type: Number,
      min: [40, 'Average heart rate seems too low'],
      max: [220, 'Average heart rate seems too high']
    },
    max: {
      type: Number,
      min: [40, 'Max heart rate seems too low'],
      max: [220, 'Max heart rate seems too high']
    }
  },
  location: {
    name: String,
    coordinates: {
      latitude: {
        type: Number,
        min: [-90, 'Latitude must be between -90 and 90'],
        max: [90, 'Latitude must be between -90 and 90']
      },
      longitude: {
        type: Number,
        min: [-180, 'Longitude must be between -180 and 180'],
        max: [180, 'Longitude must be between -180 and 180']
      }
    }
  },
  weather: {
    temperature: Number,
    humidity: Number,
    conditions: String
  },
  equipment: [{
    type: String,
    trim: true
  }],
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  activityDate: {
    type: Date,
    required: [true, 'Activity date is required'],
    default: Date.now
  },
  isCompleted: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  images: [{
    type: String
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for activity duration in hours
ActivitySchema.virtual('durationInHours').get(function() {
  return Number((this.duration / 60).toFixed(2));
});

// Virtual for calories per minute
ActivitySchema.virtual('caloriesPerMinute').get(function() {
  if (this.caloriesBurned && this.duration) {
    return Number((this.caloriesBurned / this.duration).toFixed(2));
  }
  return 0;
});

// Index for efficient queries
ActivitySchema.index({ user: 1, activityDate: -1 });
ActivitySchema.index({ type: 1 });
ActivitySchema.index({ activityDate: -1 });

// Pre-populate user information
ActivitySchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name email profileImage'
  });
  next();
});

module.exports = mongoose.model('Activity', ActivitySchema);
