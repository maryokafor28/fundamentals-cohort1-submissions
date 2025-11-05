const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Doctor name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number']
  },
  specialization: {
    type: String,
    required: [true, 'Specialization is required'],
    enum: [
      'general_practitioner', 'cardiologist', 'dermatologist', 'endocrinologist',
      'gastroenterologist', 'neurologist', 'oncologist', 'orthopedic',
      'pediatrician', 'psychiatrist', 'pulmonologist', 'radiologist',
      'surgeon', 'urologist', 'gynecologist', 'ophthalmologist',
      'ent', 'rheumatologist', 'nephrologist', 'hematologist',
      'infectious_disease', 'emergency_medicine', 'family_medicine',
      'internal_medicine', 'physical_medicine', 'pathology', 'other'
    ]
  },
  licenseNumber: {
    type: String,
    required: [true, 'License number is required'],
    unique: true,
    trim: true
  },
  yearsOfExperience: {
    type: Number,
    required: [true, 'Years of experience is required'],
    min: [0, 'Years of experience cannot be negative'],
    max: [70, 'Years of experience cannot exceed 70']
  },
  education: [{
    degree: {
      type: String,
      required: true
    },
    institution: {
      type: String,
      required: true
    },
    year: {
      type: Number,
      required: true,
      min: [1950, 'Year must be after 1950'],
      max: [new Date().getFullYear(), 'Year cannot be in the future']
    }
  }],
  certifications: [{
    name: {
      type: String,
      required: true
    },
    issuingBody: String,
    issueDate: Date,
    expiryDate: Date
  }],
  clinic: {
    name: {
      type: String,
      required: [true, 'Clinic name is required'],
      trim: true
    },
    address: {
      street: {
        type: String,
        required: [true, 'Street address is required']
      },
      city: {
        type: String,
        required: [true, 'City is required']
      },
      state: {
        type: String,
        required: [true, 'State is required']
      },
      zipCode: {
        type: String,
        required: [true, 'Zip code is required']
      },
      country: {
        type: String,
        required: [true, 'Country is required']
      }
    },
    phone: String,
    email: String,
    website: String
  },
  availability: [{
    dayOfWeek: {
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      required: true
    },
    startTime: {
      type: String,
      required: true,
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter valid time in HH:MM format']
    },
    endTime: {
      type: String,
      required: true,
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter valid time in HH:MM format']
    },
    isAvailable: {
      type: Boolean,
      default: true
    }
  }],
  consultationFee: {
    amount: {
      type: Number,
      required: [true, 'Consultation fee is required'],
      min: [0, 'Fee cannot be negative']
    },
    currency: {
      type: String,
      default: 'USD',
      enum: ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR']
    }
  },
  rating: {
    average: {
      type: Number,
      min: [0, 'Rating cannot be negative'],
      max: [5, 'Rating cannot exceed 5'],
      default: 0
    },
    totalReviews: {
      type: Number,
      default: 0,
      min: [0, 'Total reviews cannot be negative']
    }
  },
  languages: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  profileImage: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    maxlength: [1000, 'Bio cannot exceed 1000 characters']
  },
  acceptsInsurance: {
    type: Boolean,
    default: true
  },
  insuranceNetworks: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  socialMedia: {
    linkedin: String,
    twitter: String,
    facebook: String
  },
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full clinic address
DoctorSchema.virtual('fullClinicAddress').get(function() {
  if (this.clinic && this.clinic.address) {
    const addr = this.clinic.address;
    return `${addr.street}, ${addr.city}, ${addr.state} ${addr.zipCode}, ${addr.country}`;
  }
  return '';
});

// Virtual for experience level
DoctorSchema.virtual('experienceLevel').get(function() {
  if (this.yearsOfExperience < 5) return 'Junior';
  if (this.yearsOfExperience < 15) return 'Senior';
  return 'Expert';
});

// Index for efficient queries
DoctorSchema.index({ specialization: 1, isActive: 1 });
DoctorSchema.index({ 'clinic.address.city': 1, 'clinic.address.state': 1 });
DoctorSchema.index({ name: 'text', 'clinic.name': 'text' });
DoctorSchema.index({ email: 1 });
DoctorSchema.index({ licenseNumber: 1 });

// Validate availability times
DoctorSchema.pre('save', function(next) {
  if (this.availability && this.availability.length > 0) {
    for (let schedule of this.availability) {
      const [startHour, startMin] = schedule.startTime.split(':').map(Number);
      const [endHour, endMin] = schedule.endTime.split(':').map(Number);
      
      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;
      
      if (startMinutes >= endMinutes) {
        return next(new Error('End time must be after start time'));
      }
    }
  }
  next();
});

module.exports = mongoose.model('Doctor', DoctorSchema);
