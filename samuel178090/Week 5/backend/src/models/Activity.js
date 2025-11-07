import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['running', 'walking', 'cycling', 'swimming', 'gym', 'yoga', 'other']
  },
  duration: {
    type: Number, // in minutes
    required: true,
    min: 1
  },
  caloriesBurned: {
    type: Number,
    required: true,
    min: 0
  },
  heartRate: {
    before: Number,
    after: Number,
    average: Number
  },
  bloodPressure: {
    systolic: Number,
    diastolic: Number
  },
  vitals: {
    temperature: Number,
    oxygenSaturation: Number,
    respiratoryRate: Number
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  notes: {
    type: String,
    trim: true
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor'
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'
  }
}, {
  timestamps: true
});

export default mongoose.model('Activity', activitySchema);