const express = require('express');
const { body, validationResult } = require('express-validator');
const Appointment = require('../models/Appointment');
const router = express.Router();

// Validation middleware
const validateAppointment = [
  body('patient').isMongoId().withMessage('Valid patient ID is required'),
  body('doctor').isMongoId().withMessage('Valid doctor ID is required'),
  body('appointmentDate').isISO8601().withMessage('Please provide a valid appointment date'),
  body('appointmentTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Please provide valid time in HH:MM format'),
  body('duration').isInt({ min: 15, max: 480 }).withMessage('Duration must be between 15 minutes and 8 hours'),
  body('type').isIn([
    'consultation', 'follow_up', 'check_up', 'emergency',
    'surgery', 'diagnostic', 'preventive', 'vaccination',
    'therapy', 'counseling', 'procedure', 'second_opinion',
    'telemedicine', 'other'
  ]).withMessage('Please select a valid appointment type'),
  body('reason').trim().isLength({ min: 1, max: 500 }).withMessage('Reason is required and must be less than 500 characters'),
  body('priority').optional().isIn(['low', 'normal', 'high', 'urgent']).withMessage('Please select a valid priority level')
];

const validateAppointmentUpdate = [
  body('appointmentDate').optional().isISO8601().withMessage('Please provide a valid appointment date'),
  body('appointmentTime').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Please provide valid time in HH:MM format'),
  body('duration').optional().isInt({ min: 15, max: 480 }).withMessage('Duration must be between 15 minutes and 8 hours'),
  body('type').optional().isIn([
    'consultation', 'follow_up', 'check_up', 'emergency',
    'surgery', 'diagnostic', 'preventive', 'vaccination',
    'therapy', 'counseling', 'procedure', 'second_opinion',
    'telemedicine', 'other'
  ]).withMessage('Please select a valid appointment type'),
  body('status').optional().isIn(['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show', 'rescheduled']).withMessage('Please select a valid status'),
  body('priority').optional().isIn(['low', 'normal', 'high', 'urgent']).withMessage('Please select a valid priority level')
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

// @route   GET /api/appointments
// @desc    Get all appointments with pagination and filtering
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const patient = req.query.patient;
    const doctor = req.query.doctor;
    const status = req.query.status;
    const type = req.query.type;
    const priority = req.query.priority;
    const dateFrom = req.query.dateFrom;
    const dateTo = req.query.dateTo;
    const sortBy = req.query.sortBy || 'appointmentDate';
    const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;

    // Build query
    let query = {};
    
    if (patient) {
      query.patient = patient;
    }
    
    if (doctor) {
      query.doctor = doctor;
    }
    
    if (status) {
      query.status = status;
    }
    
    if (type) {
      query.type = type;
    }
    
    if (priority) {
      query.priority = priority;
    }
    
    if (dateFrom || dateTo) {
      query.appointmentDate = {};
      if (dateFrom) query.appointmentDate.$gte = new Date(dateFrom);
      if (dateTo) query.appointmentDate.$lte = new Date(dateTo);
    }

    const appointments = await Appointment.find(query)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .populate('patient', 'name email phone profileImage dateOfBirth gender')
      .populate('doctor', 'name email phone specialization clinic rating profileImage');

    const total = await Appointment.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: appointments,
      pagination: {
        currentPage: page,
        totalPages,
        totalAppointments: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching appointments',
      error: error.message
    });
  }
});

// @route   GET /api/appointments/:id
// @desc    Get appointment by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'name email phone profileImage dateOfBirth gender medicalConditions allergies')
      .populate('doctor', 'name email phone specialization clinic rating profileImage yearsOfExperience');
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.status(200).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    console.error('Error fetching appointment:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid appointment ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error fetching appointment',
      error: error.message
    });
  }
});

// @route   POST /api/appointments
// @desc    Create new appointment
// @access  Public
router.post('/', validateAppointment, handleValidationErrors, async (req, res) => {
  try {
    // Check for scheduling conflicts
    const appointmentDateTime = new Date(req.body.appointmentDate);
    const [hours, minutes] = req.body.appointmentTime.split(':').map(Number);
    appointmentDateTime.setHours(hours, minutes, 0, 0);

    const endDateTime = new Date(appointmentDateTime);
    endDateTime.setMinutes(endDateTime.getMinutes() + req.body.duration);

    const conflictingAppointment = await Appointment.findOne({
      doctor: req.body.doctor,
      appointmentDate: req.body.appointmentDate,
      status: { $nin: ['cancelled', 'no_show'] },
      $or: [
        {
          $and: [
            { appointmentTime: { $lte: req.body.appointmentTime } },
            { 
              $expr: {
                $gte: [
                  { $dateAdd: {
                    startDate: { $dateFromString: { dateString: { $concat: [
                      { $dateToString: { date: "$appointmentDate", format: "%Y-%m-%d" } },
                      "T",
                      "$appointmentTime",
                      ":00"
                    ]}}},
                    unit: "minute",
                    amount: "$duration"
                  }},
                  appointmentDateTime
                ]
              }
            }
          ]
        }
      ]
    });

    if (conflictingAppointment) {
      return res.status(400).json({
        success: false,
        message: 'Doctor is not available at this time slot'
      });
    }

    const appointment = new Appointment(req.body);
    await appointment.save();

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('patient', 'name email phone profileImage')
      .populate('doctor', 'name email phone specialization clinic');

    res.status(201).json({
      success: true,
      message: 'Appointment created successfully',
      data: populatedAppointment
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating appointment',
      error: error.message
    });
  }
});

// @route   PUT /api/appointments/:id
// @desc    Update appointment
// @access  Public
router.put('/:id', validateAppointmentUpdate, handleValidationErrors, async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { 
        new: true, 
        runValidators: true 
      }
    ).populate('patient', 'name email phone profileImage')
     .populate('doctor', 'name email phone specialization clinic');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Appointment updated successfully',
      data: appointment
    });
  } catch (error) {
    console.error('Error updating appointment:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid appointment ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error updating appointment',
      error: error.message
    });
  }
});

// @route   DELETE /api/appointments/:id
// @desc    Cancel appointment
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const { reason } = req.body;
    
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'cancelled',
        cancellation: {
          cancelledBy: 'patient', // This could be dynamic based on who's cancelling
          cancelledAt: new Date(),
          reason: reason || 'No reason provided'
        }
      },
      { new: true }
    ).populate('patient', 'name email phone')
     .populate('doctor', 'name email phone specialization');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Appointment cancelled successfully',
      data: appointment
    });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid appointment ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error cancelling appointment',
      error: error.message
    });
  }
});

// @route   PUT /api/appointments/:id/status
// @desc    Update appointment status
// @access  Public
router.put('/:id/status', async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    if (!['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show', 'rescheduled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const updateData = { status };
    if (notes) {
      updateData['notes.doctorNotes'] = notes;
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('patient', 'name email phone')
     .populate('doctor', 'name email phone specialization');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.status(200).json({
      success: true,
      message: `Appointment status updated to ${status}`,
      data: appointment
    });
  } catch (error) {
    console.error('Error updating appointment status:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid appointment ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error updating appointment status',
      error: error.message
    });
  }
});

// @route   GET /api/appointments/patient/:patientId/upcoming
// @desc    Get upcoming appointments for a patient
// @access  Public
router.get('/patient/:patientId/upcoming', async (req, res) => {
  try {
    const patientId = req.params.patientId;
    const limit = parseInt(req.query.limit) || 10;

    const appointments = await Appointment.find({
      patient: patientId,
      appointmentDate: { $gte: new Date() },
      status: { $nin: ['cancelled', 'no_show', 'completed'] }
    }).sort({ appointmentDate: 1, appointmentTime: 1 })
      .limit(limit)
      .populate('doctor', 'name specialization clinic phone profileImage');

    res.status(200).json({
      success: true,
      data: appointments,
      total: appointments.length
    });
  } catch (error) {
    console.error('Error fetching upcoming appointments:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid patient ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error fetching upcoming appointments',
      error: error.message
    });
  }
});

// @route   GET /api/appointments/doctor/:doctorId/schedule
// @desc    Get doctor's appointment schedule for a specific date
// @access  Public
router.get('/doctor/:doctorId/schedule', async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    const date = req.query.date || new Date().toISOString().split('T')[0];

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const appointments = await Appointment.find({
      doctor: doctorId,
      appointmentDate: {
        $gte: startOfDay,
        $lte: endOfDay
      },
      status: { $nin: ['cancelled', 'no_show'] }
    }).sort({ appointmentTime: 1 })
      .populate('patient', 'name phone profileImage');

    res.status(200).json({
      success: true,
      data: {
        date,
        appointments,
        total: appointments.length
      }
    });
  } catch (error) {
    console.error('Error fetching doctor schedule:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid doctor ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error fetching doctor schedule',
      error: error.message
    });
  }
});

// @route   GET /api/appointments/stats/:userId
// @desc    Get appointment statistics for user (patient or doctor)
// @access  Public
router.get('/stats/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const userType = req.query.userType || 'patient'; // 'patient' or 'doctor'
    const dateFrom = req.query.dateFrom;
    const dateTo = req.query.dateTo;

    // Build date query
    let dateQuery = {};
    if (dateFrom || dateTo) {
      dateQuery.appointmentDate = {};
      if (dateFrom) dateQuery.appointmentDate.$gte = new Date(dateFrom);
      if (dateTo) dateQuery.appointmentDate.$lte = new Date(dateTo);
    }

    const queryField = userType === 'patient' ? 'patient' : 'doctor';
    const appointments = await Appointment.find({
      [queryField]: userId,
      ...dateQuery
    });

    // Calculate statistics
    const totalAppointments = appointments.length;
    const appointmentsByStatus = appointments.reduce((acc, appointment) => {
      acc[appointment.status] = (acc[appointment.status] || 0) + 1;
      return acc;
    }, {});

    const appointmentsByType = appointments.reduce((acc, appointment) => {
      acc[appointment.type] = (acc[appointment.type] || 0) + 1;
      return acc;
    }, {});

    const completedAppointments = appointments.filter(apt => apt.status === 'completed');
    const avgRating = completedAppointments.length > 0 && userType === 'doctor' 
      ? completedAppointments.reduce((sum, apt) => sum + (apt.rating?.patientRating || 0), 0) / completedAppointments.length
      : null;

    const upcomingAppointments = appointments.filter(apt => 
      new Date(apt.appointmentDate) >= new Date() && 
      !['cancelled', 'no_show', 'completed'].includes(apt.status)
    ).length;

    const stats = {
      totalAppointments,
      upcomingAppointments,
      completedAppointments: completedAppointments.length,
      cancelledAppointments: appointmentsByStatus.cancelled || 0,
      appointmentsByStatus,
      appointmentsByType,
      ...(userType === 'doctor' && avgRating !== null && { averageRating: Math.round(avgRating * 10) / 10 })
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching appointment stats:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error fetching appointment stats',
      error: error.message
    });
  }
});

module.exports = router;
