const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Patient is required']
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: [true, 'Doctor is required']
  },
  appointmentDate: {
    type: Date,
    required: [true, 'Appointment date is required']
  },
  appointmentTime: {
    type: String,
    required: [true, 'Appointment time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter valid time in HH:MM format']
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: [15, 'Duration must be at least 15 minutes'],
    max: [480, 'Duration cannot exceed 8 hours'],
    default: 30
  },
  type: {
    type: String,
    required: [true, 'Appointment type is required'],
    enum: [
      'consultation', 'follow_up', 'check_up', 'emergency',
      'surgery', 'diagnostic', 'preventive', 'vaccination',
      'therapy', 'counseling', 'procedure', 'second_opinion',
      'telemedicine', 'other'
    ]
  },
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show', 'rescheduled'],
    default: 'scheduled'
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  reason: {
    type: String,
    required: [true, 'Reason for appointment is required'],
    trim: true,
    maxlength: [500, 'Reason cannot exceed 500 characters']
  },
  symptoms: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe'],
      default: 'mild'
    },
    duration: String,
    description: String
  }],
  vitalSigns: {
    bloodPressure: {
      systolic: {
        type: Number,
        min: [70, 'Systolic BP seems too low'],
        max: [250, 'Systolic BP seems too high']
      },
      diastolic: {
        type: Number,
        min: [40, 'Diastolic BP seems too low'],
        max: [150, 'Diastolic BP seems too high']
      }
    },
    heartRate: {
      type: Number,
      min: [40, 'Heart rate seems too low'],
      max: [220, 'Heart rate seems too high']
    },
    temperature: {
      value: {
        type: Number,
        min: [35, 'Temperature seems too low'],
        max: [45, 'Temperature seems too high']
      },
      unit: {
        type: String,
        enum: ['celsius', 'fahrenheit'],
        default: 'celsius'
      }
    },
    weight: {
      type: Number,
      min: [20, 'Weight seems too low'],
      max: [500, 'Weight seems too high']
    },
    height: {
      type: Number,
      min: [50, 'Height seems too low'],
      max: [300, 'Height seems too high']
    },
    oxygenSaturation: {
      type: Number,
      min: [70, 'Oxygen saturation seems too low'],
      max: [100, 'Oxygen saturation cannot exceed 100%']
    }
  },
  diagnosis: [{
    condition: {
      type: String,
      required: true,
      trim: true
    },
    icdCode: String,
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe'],
      default: 'mild'
    },
    isPrimary: {
      type: Boolean,
      default: false
    },
    notes: String
  }],
  treatment: {
    medications: [{
      name: {
        type: String,
        required: true,
        trim: true
      },
      dosage: String,
      frequency: String,
      duration: String,
      instructions: String,
      sideEffects: [String]
    }],
    procedures: [{
      name: {
        type: String,
        required: true,
        trim: true
      },
      description: String,
      date: Date,
      notes: String
    }],
    recommendations: [{
      type: String,
      trim: true
    }],
    followUpDate: Date,
    restrictions: [{
      type: String,
      trim: true
    }]
  },
  notes: {
    doctorNotes: {
      type: String,
      maxlength: [2000, 'Doctor notes cannot exceed 2000 characters']
    },
    patientNotes: {
      type: String,
      maxlength: [1000, 'Patient notes cannot exceed 1000 characters']
    },
    privateNotes: {
      type: String,
      maxlength: [1000, 'Private notes cannot exceed 1000 characters']
    }
  },
  cost: {
    consultationFee: {
      type: Number,
      min: [0, 'Fee cannot be negative']
    },
    additionalCharges: [{
      description: String,
      amount: Number
    }],
    totalAmount: {
      type: Number,
      min: [0, 'Total amount cannot be negative']
    },
    currency: {
      type: String,
      default: 'USD',
      enum: ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR']
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'partially_paid', 'refunded', 'disputed'],
      default: 'pending'
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'card', 'insurance', 'bank_transfer', 'online', 'other']
    }
  },
  reminders: [{
    type: {
      type: String,
      enum: ['email', 'sms', 'push'],
      default: 'email'
    },
    reminderTime: {
      type: Number,
      min: [5, 'Reminder time must be at least 5 minutes'],
      default: 60
    },
    isSent: {
      type: Boolean,
      default: false
    }
  }],
  attachments: [{
    name: String,
    url: String,
    fileType: String,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }],
  rating: {
    patientRating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5']
    },
    patientReview: String,
    doctorRating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5']
    }
  },
  cancellation: {
    cancelledBy: {
      type: String,
      enum: ['patient', 'doctor', 'system']
    },
    cancelledAt: Date,
    reason: String,
    refundAmount: Number
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for appointment end time
AppointmentSchema.virtual('endTime').get(function() {
  if (this.appointmentTime && this.duration) {
    const [hours, minutes] = this.appointmentTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + this.duration;
    const endHours = Math.floor(totalMinutes / 60);
    const endMins = totalMinutes % 60;
    return `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
  }
  return null;
});

// Virtual for total cost calculation
AppointmentSchema.virtual('calculatedTotal').get(function() {
  let total = this.cost?.consultationFee || 0;
  if (this.cost?.additionalCharges) {
    total += this.cost.additionalCharges.reduce((sum, charge) => sum + (charge.amount || 0), 0);
  }
  return total;
});

// Virtual for appointment status color
AppointmentSchema.virtual('statusColor').get(function() {
  const colors = {
    scheduled: '#007bff',
    confirmed: '#28a745',
    in_progress: '#ffc107',
    completed: '#6c757d',
    cancelled: '#dc3545',
    no_show: '#fd7e14',
    rescheduled: '#6f42c1'
  };
  return colors[this.status] || '#6c757d';
});

// Index for efficient queries
AppointmentSchema.index({ patient: 1, appointmentDate: -1 });
AppointmentSchema.index({ doctor: 1, appointmentDate: 1 });
AppointmentSchema.index({ status: 1, appointmentDate: 1 });
AppointmentSchema.index({ appointmentDate: 1, appointmentTime: 1 });

// Pre-populate patient and doctor information
AppointmentSchema.pre(/^find/, function(next) {
  this.populate([
    {
      path: 'patient',
      select: 'name email phone profileImage dateOfBirth gender'
    },
    {
      path: 'doctor',
      select: 'name email phone specialization clinic rating profileImage'
    }
  ]);
  next();
});

// Validate appointment is not in the past (for new appointments)
AppointmentSchema.pre('save', function(next) {
  if (this.isNew) {
    const appointmentDateTime = new Date(this.appointmentDate);
    const [hours, minutes] = this.appointmentTime.split(':').map(Number);
    appointmentDateTime.setHours(hours, minutes, 0, 0);
    
    if (appointmentDateTime < new Date()) {
      return next(new Error('Appointment cannot be scheduled in the past'));
    }
  }
  
  // Calculate total amount
  if (this.cost) {
    let total = this.cost.consultationFee || 0;
    if (this.cost.additionalCharges) {
      total += this.cost.additionalCharges.reduce((sum, charge) => sum + (charge.amount || 0), 0);
    }
    this.cost.totalAmount = total;
  }
  
  next();
});

module.exports = mongoose.model('Appointment', AppointmentSchema);
