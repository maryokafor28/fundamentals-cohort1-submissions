const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor'
  },
  title: {
    type: String,
    required: [true, 'Report title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  type: {
    type: String,
    required: [true, 'Report type is required'],
    enum: [
      'medical_report', 'lab_result', 'imaging_report', 'pathology_report',
      'fitness_report', 'nutrition_report', 'mental_health_report',
      'prescription', 'discharge_summary', 'referral_letter',
      'insurance_claim', 'fitness_assessment', 'other'
    ]
  },
  category: {
    type: String,
    enum: [
      'blood_work', 'urine_analysis', 'x_ray', 'mri', 'ct_scan',
      'ultrasound', 'ecg', 'echo', 'biopsy', 'allergy_test',
      'fitness_test', 'body_composition', 'cardiovascular',
      'respiratory', 'neurological', 'orthopedic', 'dermatological',
      'psychological', 'nutritional', 'other'
    ]
  },
  reportDate: {
    type: Date,
    required: [true, 'Report date is required'],
    default: Date.now
  },
  testDate: {
    type: Date
  },
  laboratory: {
    name: String,
    address: String,
    phone: String,
    email: String,
    licenseNumber: String
  },
  results: [{
    parameter: {
      type: String,
      required: true,
      trim: true
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    unit: String,
    referenceRange: {
      min: mongoose.Schema.Types.Mixed,
      max: mongoose.Schema.Types.Mixed,
      normal: String
    },
    status: {
      type: String,
      enum: ['normal', 'abnormal', 'low', 'high', 'critical', 'pending'],
      default: 'normal'
    },
    notes: String
  }],
  summary: {
    type: String,
    maxlength: [2000, 'Summary cannot exceed 2000 characters']
  },
  findings: [{
    finding: {
      type: String,
      required: true,
      trim: true
    },
    severity: {
      type: String,
      enum: ['normal', 'mild', 'moderate', 'severe', 'critical'],
      default: 'normal'
    },
    description: String,
    recommendations: [String]
  }],
  interpretation: {
    type: String,
    maxlength: [1500, 'Interpretation cannot exceed 1500 characters']
  },
  recommendations: [{
    type: String,
    trim: true
  }],
  followUp: {
    required: {
      type: Boolean,
      default: false
    },
    timeframe: String,
    instructions: String,
    nextAppointmentDate: Date
  },
  attachments: [{
    name: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    fileType: {
      type: String,
      enum: ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx', 'txt', 'other'],
      default: 'pdf'
    },
    fileSize: Number,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }],
  images: [{
    name: String,
    url: String,
    description: String,
    annotations: [{
      x: Number,
      y: Number,
      width: Number,
      height: Number,
      note: String
    }]
  }],
  status: {
    type: String,
    enum: ['draft', 'pending_review', 'reviewed', 'final', 'amended', 'cancelled'],
    default: 'draft'
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  confidentiality: {
    type: String,
    enum: ['public', 'restricted', 'confidential', 'highly_confidential'],
    default: 'confidential'
  },
  reviewedBy: {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor'
    },
    reviewDate: Date,
    reviewNotes: String,
    approved: {
      type: Boolean,
      default: false
    }
  },
  technician: {
    name: String,
    id: String,
    signature: String
  },
  equipment: {
    name: String,
    model: String,
    serialNumber: String,
    calibrationDate: Date
  },
  qualityControl: {
    passed: {
      type: Boolean,
      default: true
    },
    checkedBy: String,
    checkDate: Date,
    notes: String
  },
  billing: {
    cost: {
      type: Number,
      min: [0, 'Cost cannot be negative']
    },
    currency: {
      type: String,
      default: 'USD',
      enum: ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR']
    },
    covered: {
      type: Boolean,
      default: false
    },
    insuranceClaim: String
  },
  sharing: {
    sharedWith: [{
      doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor'
      },
      sharedDate: {
        type: Date,
        default: Date.now
      },
      permissions: {
        type: [String],
        enum: ['view', 'edit', 'share'],
        default: ['view']
      }
    }],
    isPublic: {
      type: Boolean,
      default: false
    },
    accessLevel: {
      type: String,
      enum: ['private', 'doctor_only', 'healthcare_team', 'family', 'public'],
      default: 'private'
    }
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for abnormal results count
ReportSchema.virtual('abnormalResultsCount').get(function() {
  if (this.results && this.results.length > 0) {
    return this.results.filter(result => 
      result.status && !['normal', 'pending'].includes(result.status)
    ).length;
  }
  return 0;
});

// Virtual for critical findings count
ReportSchema.virtual('criticalFindingsCount').get(function() {
  if (this.findings && this.findings.length > 0) {
    return this.findings.filter(finding => 
      finding.severity === 'critical' || finding.severity === 'severe'
    ).length;
  }
  return 0;
});

// Virtual for overall status based on results
ReportSchema.virtual('overallStatus').get(function() {
  if (!this.results || this.results.length === 0) return 'pending';
  
  const hasCritical = this.results.some(result => result.status === 'critical');
  const hasAbnormal = this.results.some(result => ['abnormal', 'low', 'high'].includes(result.status));
  
  if (hasCritical) return 'critical';
  if (hasAbnormal) return 'abnormal';
  return 'normal';
});

// Virtual for days since report
ReportSchema.virtual('daysOld').get(function() {
  const today = new Date();
  const reportDate = new Date(this.reportDate);
  const diffTime = Math.abs(today - reportDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Index for efficient queries
ReportSchema.index({ user: 1, reportDate: -1 });
ReportSchema.index({ type: 1, category: 1 });
ReportSchema.index({ status: 1, priority: 1 });
ReportSchema.index({ appointment: 1 });
ReportSchema.index({ doctor: 1 });
ReportSchema.index({ reportDate: -1 });

// Text search index
ReportSchema.index({ 
  title: 'text', 
  summary: 'text', 
  interpretation: 'text',
  'findings.finding': 'text'
});

// Pre-populate related documents
ReportSchema.pre(/^find/, function(next) {
  this.populate([
    {
      path: 'user',
      select: 'name email profileImage'
    },
    {
      path: 'doctor',
      select: 'name specialization clinic.name'
    },
    {
      path: 'appointment',
      select: 'appointmentDate type reason status'
    },
    {
      path: 'reviewedBy.doctor',
      select: 'name specialization'
    }
  ]);
  next();
});

// Auto-generate summary for certain report types
ReportSchema.pre('save', function(next) {
  if (this.isNew && this.type === 'lab_result' && this.results && this.results.length > 0) {
    const abnormalResults = this.results.filter(result => 
      result.status && !['normal', 'pending'].includes(result.status)
    );
    
    if (abnormalResults.length === 0) {
      this.summary = 'All test results are within normal ranges.';
    } else {
      const abnormalList = abnormalResults.map(result => 
        `${result.parameter}: ${result.value} ${result.unit || ''} (${result.status})`
      ).join(', ');
      this.summary = `Abnormal findings: ${abnormalList}`;
    }
  }
  next();
});

module.exports = mongoose.model('Report', ReportSchema);
