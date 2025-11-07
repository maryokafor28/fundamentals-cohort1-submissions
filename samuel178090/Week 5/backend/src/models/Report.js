import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  generatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },

  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  totalActivities: {
    type: Number,
    default: 0
  },
  totalCaloriesBurned: {
    type: Number,
    default: 0
  },
  totalCaloriesConsumed: {
    type: Number,
    default: 0
  },
  summary: {
    type: String,
    trim: true
  },
  testResults: [{
    testName: String,
    result: String,
    normalRange: String,
    unit: String,
    status: { type: String, enum: ['normal', 'abnormal', 'critical'] }
  }],
  diagnosis: {
    primary: String,
    secondary: [String],
    icd10Code: String
  },
  prescriptions: [{
    medication: String,
    dosage: String,
    frequency: String,
    duration: String,
    instructions: String
  }],
  findings: {
    symptoms: [String],
    examination: String,
    recommendations: String
  },
  reportType: {
    type: String,
    enum: ['lab', 'radiology', 'pathology', 'consultation', 'discharge', 'weekly', 'monthly', 'custom'],
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Report', reportSchema);