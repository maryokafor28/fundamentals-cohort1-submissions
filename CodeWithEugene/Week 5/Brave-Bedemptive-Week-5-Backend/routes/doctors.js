const express = require('express');
const { body, validationResult } = require('express-validator');
const Doctor = require('../models/Doctor');
const router = express.Router();

// Validation middleware
const validateDoctor = [
  body('name').trim().isLength({ min: 1, max: 100 }).withMessage('Name is required and must be less than 100 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('phone').matches(/^\+?[1-9]\d{1,14}$/).withMessage('Please provide a valid phone number'),
  body('specialization').isIn([
    'general_practitioner', 'cardiologist', 'dermatologist', 'endocrinologist',
    'gastroenterologist', 'neurologist', 'oncologist', 'orthopedic',
    'pediatrician', 'psychiatrist', 'pulmonologist', 'radiologist',
    'surgeon', 'urologist', 'gynecologist', 'ophthalmologist',
    'ent', 'rheumatologist', 'nephrologist', 'hematologist',
    'infectious_disease', 'emergency_medicine', 'family_medicine',
    'internal_medicine', 'physical_medicine', 'pathology', 'other'
  ]).withMessage('Please select a valid specialization'),
  body('licenseNumber').trim().isLength({ min: 1 }).withMessage('License number is required'),
  body('yearsOfExperience').isInt({ min: 0, max: 70 }).withMessage('Years of experience must be between 0 and 70'),
  body('clinic.name').trim().isLength({ min: 1 }).withMessage('Clinic name is required'),
  body('clinic.address.street').trim().isLength({ min: 1 }).withMessage('Street address is required'),
  body('clinic.address.city').trim().isLength({ min: 1 }).withMessage('City is required'),
  body('clinic.address.state').trim().isLength({ min: 1 }).withMessage('State is required'),
  body('clinic.address.zipCode').trim().isLength({ min: 1 }).withMessage('Zip code is required'),
  body('clinic.address.country').trim().isLength({ min: 1 }).withMessage('Country is required'),
  body('consultationFee.amount').isFloat({ min: 0 }).withMessage('Consultation fee must be positive')
];

const validateDoctorUpdate = [
  body('name').optional().trim().isLength({ min: 1, max: 100 }).withMessage('Name must be less than 100 characters'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('phone').optional().matches(/^\+?[1-9]\d{1,14}$/).withMessage('Please provide a valid phone number'),
  body('specialization').optional().isIn([
    'general_practitioner', 'cardiologist', 'dermatologist', 'endocrinologist',
    'gastroenterologist', 'neurologist', 'oncologist', 'orthopedic',
    'pediatrician', 'psychiatrist', 'pulmonologist', 'radiologist',
    'surgeon', 'urologist', 'gynecologist', 'ophthalmologist',
    'ent', 'rheumatologist', 'nephrologist', 'hematologist',
    'infectious_disease', 'emergency_medicine', 'family_medicine',
    'internal_medicine', 'physical_medicine', 'pathology', 'other'
  ]).withMessage('Please select a valid specialization'),
  body('yearsOfExperience').optional().isInt({ min: 0, max: 70 }).withMessage('Years of experience must be between 0 and 70'),
  body('consultationFee.amount').optional().isFloat({ min: 0 }).withMessage('Consultation fee must be positive')
];

// Helper function to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// @route   GET /api/doctors
// @desc    Get all doctors with pagination and filtering
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const specialization = req.query.specialization;
    const city = req.query.city;
    const state = req.query.state;
    const isActive = req.query.isActive !== 'false'; // Default to true
    const isVerified = req.query.isVerified;
    const sortBy = req.query.sortBy || 'name';
    const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;

    // Build query
    let query = { isActive };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { 'clinic.name': { $regex: search, $options: 'i' } }
      ];
    }
    
    if (specialization) {
      query.specialization = specialization;
    }
    
    if (city) {
      query['clinic.address.city'] = { $regex: city, $options: 'i' };
    }
    
    if (state) {
      query['clinic.address.state'] = { $regex: state, $options: 'i' };
    }
    
    if (isVerified !== undefined) {
      query.isVerified = isVerified === 'true';
    }

    const doctors = await Doctor.find(query)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);

    const total = await Doctor.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: doctors,
      pagination: {
        currentPage: page,
        totalPages,
        totalDoctors: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching doctors',
      error: error.message
    });
  }
});

// @route   GET /api/doctors/:id
// @desc    Get doctor by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    res.status(200).json({
      success: true,
      data: doctor
    });
  } catch (error) {
    console.error('Error fetching doctor:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid doctor ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error fetching doctor',
      error: error.message
    });
  }
});

// @route   POST /api/doctors
// @desc    Create new doctor
// @access  Public
router.post('/', validateDoctor, handleValidationErrors, async (req, res) => {
  try {
    // Check if doctor already exists with same email or license
    const existingDoctor = await Doctor.findOne({
      $or: [
        { email: req.body.email },
        { licenseNumber: req.body.licenseNumber }
      ]
    });

    if (existingDoctor) {
      return res.status(400).json({
        success: false,
        message: 'Doctor with this email or license number already exists'
      });
    }

    const doctor = new Doctor(req.body);
    await doctor.save();

    res.status(201).json({
      success: true,
      message: 'Doctor created successfully',
      data: doctor
    });
  } catch (error) {
    console.error('Error creating doctor:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email or license number already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error creating doctor',
      error: error.message
    });
  }
});

// @route   PUT /api/doctors/:id
// @desc    Update doctor
// @access  Public
router.put('/:id', validateDoctorUpdate, handleValidationErrors, async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { 
        new: true, 
        runValidators: true 
      }
    );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Doctor updated successfully',
      data: doctor
    });
  } catch (error) {
    console.error('Error updating doctor:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid doctor ID'
      });
    }
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email or license number already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error updating doctor',
      error: error.message
    });
  }
});

// @route   DELETE /api/doctors/:id
// @desc    Delete doctor (soft delete)
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Doctor deleted successfully',
      data: doctor
    });
  } catch (error) {
    console.error('Error deleting doctor:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid doctor ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error deleting doctor',
      error: error.message
    });
  }
});

// @route   GET /api/doctors/:id/availability
// @desc    Get doctor's availability schedule
// @access  Public
router.get('/:id/availability', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).select('availability name');
    
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        doctorName: doctor.name,
        availability: doctor.availability || []
      }
    });
  } catch (error) {
    console.error('Error fetching doctor availability:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid doctor ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error fetching doctor availability',
      error: error.message
    });
  }
});

// @route   PUT /api/doctors/:id/availability
// @desc    Update doctor's availability schedule
// @access  Public
router.put('/:id/availability', async (req, res) => {
  try {
    const { availability } = req.body;

    // Validate availability data
    if (!Array.isArray(availability)) {
      return res.status(400).json({
        success: false,
        message: 'Availability must be an array'
      });
    }

    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { availability },
      { new: true, runValidators: true }
    );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Availability updated successfully',
      data: {
        doctorName: doctor.name,
        availability: doctor.availability
      }
    });
  } catch (error) {
    console.error('Error updating doctor availability:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid doctor ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error updating doctor availability',
      error: error.message
    });
  }
});

// @route   GET /api/doctors/search/specializations
// @desc    Get all available specializations
// @access  Public
router.get('/search/specializations', (req, res) => {
  const specializations = [
    'general_practitioner', 'cardiologist', 'dermatologist', 'endocrinologist',
    'gastroenterologist', 'neurologist', 'oncologist', 'orthopedic',
    'pediatrician', 'psychiatrist', 'pulmonologist', 'radiologist',
    'surgeon', 'urologist', 'gynecologist', 'ophthalmologist',
    'ent', 'rheumatologist', 'nephrologist', 'hematologist',
    'infectious_disease', 'emergency_medicine', 'family_medicine',
    'internal_medicine', 'physical_medicine', 'pathology', 'other'
  ];

  res.status(200).json({
    success: true,
    data: specializations
  });
});

// @route   GET /api/doctors/search/nearby
// @desc    Find doctors near a location
// @access  Public
router.get('/search/nearby', async (req, res) => {
  try {
    const { city, state, specialization, limit = 10 } = req.query;

    let query = { isActive: true };

    if (city) {
      query['clinic.address.city'] = { $regex: city, $options: 'i' };
    }
    
    if (state) {
      query['clinic.address.state'] = { $regex: state, $options: 'i' };
    }
    
    if (specialization) {
      query.specialization = specialization;
    }

    const doctors = await Doctor.find(query)
      .limit(parseInt(limit))
      .sort({ 'rating.average': -1 });

    res.status(200).json({
      success: true,
      data: doctors,
      total: doctors.length
    });
  } catch (error) {
    console.error('Error searching nearby doctors:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching nearby doctors',
      error: error.message
    });
  }
});

// @route   PUT /api/doctors/:id/rating
// @desc    Update doctor rating
// @access  Public
router.put('/:id/rating', async (req, res) => {
  try {
    const { rating, review } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    const doctor = await Doctor.findById(req.params.id);
    
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    // Calculate new average rating
    const currentTotal = doctor.rating.average * doctor.rating.totalReviews;
    const newTotal = currentTotal + rating;
    const newCount = doctor.rating.totalReviews + 1;
    const newAverage = Number((newTotal / newCount).toFixed(1));

    doctor.rating.average = newAverage;
    doctor.rating.totalReviews = newCount;

    await doctor.save();

    res.status(200).json({
      success: true,
      message: 'Rating updated successfully',
      data: {
        doctorName: doctor.name,
        rating: doctor.rating,
        review: review || null
      }
    });
  } catch (error) {
    console.error('Error updating doctor rating:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid doctor ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error updating doctor rating',
      error: error.message
    });
  }
});

module.exports = router;
