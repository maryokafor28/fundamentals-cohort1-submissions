const express = require('express');
const { body, validationResult } = require('express-validator');
const Report = require('../models/Report');
const router = express.Router();

// Validation middleware
const validateReport = [
  body('user').isMongoId().withMessage('Valid user ID is required'),
  body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title is required and must be less than 200 characters'),
  body('type').isIn([
    'medical_report', 'lab_result', 'imaging_report', 'pathology_report',
    'fitness_report', 'nutrition_report', 'mental_health_report',
    'prescription', 'discharge_summary', 'referral_letter',
    'insurance_claim', 'fitness_assessment', 'other'
  ]).withMessage('Please select a valid report type'),
  body('reportDate').optional().isISO8601().withMessage('Please provide a valid report date'),
  body('testDate').optional().isISO8601().withMessage('Please provide a valid test date')
];

const validateReportUpdate = [
  body('title').optional().trim().isLength({ min: 1, max: 200 }).withMessage('Title must be less than 200 characters'),
  body('type').optional().isIn([
    'medical_report', 'lab_result', 'imaging_report', 'pathology_report',
    'fitness_report', 'nutrition_report', 'mental_health_report',
    'prescription', 'discharge_summary', 'referral_letter',
    'insurance_claim', 'fitness_assessment', 'other'
  ]).withMessage('Please select a valid report type'),
  body('status').optional().isIn(['draft', 'pending_review', 'reviewed', 'final', 'amended', 'cancelled']).withMessage('Please select a valid status'),
  body('priority').optional().isIn(['low', 'normal', 'high', 'urgent']).withMessage('Please select a valid priority')
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

// @route   GET /api/reports
// @desc    Get all reports with pagination and filtering
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const user = req.query.user;
    const doctor = req.query.doctor;
    const type = req.query.type;
    const category = req.query.category;
    const status = req.query.status;
    const priority = req.query.priority;
    const dateFrom = req.query.dateFrom;
    const dateTo = req.query.dateTo;
    const search = req.query.search || '';
    const sortBy = req.query.sortBy || 'reportDate';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    // Build query
    let query = {};
    
    if (user) {
      query.user = user;
    }
    
    if (doctor) {
      query.doctor = doctor;
    }
    
    if (type) {
      query.type = type;
    }
    
    if (category) {
      query.category = category;
    }
    
    if (status) {
      query.status = status;
    }
    
    if (priority) {
      query.priority = priority;
    }
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (dateFrom || dateTo) {
      query.reportDate = {};
      if (dateFrom) query.reportDate.$gte = new Date(dateFrom);
      if (dateTo) query.reportDate.$lte = new Date(dateTo);
    }

    const reports = await Report.find(query)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name email profileImage')
      .populate('doctor', 'name specialization clinic.name')
      .populate('appointment', 'appointmentDate type reason');

    const total = await Report.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: reports,
      pagination: {
        currentPage: page,
        totalPages,
        totalReports: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reports',
      error: error.message
    });
  }
});

// @route   GET /api/reports/:id
// @desc    Get report by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('user', 'name email profileImage dateOfBirth gender')
      .populate('doctor', 'name specialization clinic yearsOfExperience')
      .populate('appointment', 'appointmentDate type reason status')
      .populate('reviewedBy.doctor', 'name specialization');
    
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Error fetching report:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid report ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error fetching report',
      error: error.message
    });
  }
});

// @route   POST /api/reports
// @desc    Create new report
// @access  Public
router.post('/', validateReport, handleValidationErrors, async (req, res) => {
  try {
    const report = new Report(req.body);
    await report.save();

    const populatedReport = await Report.findById(report._id)
      .populate('user', 'name email profileImage')
      .populate('doctor', 'name specialization clinic.name')
      .populate('appointment', 'appointmentDate type reason');

    res.status(201).json({
      success: true,
      message: 'Report created successfully',
      data: populatedReport
    });
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating report',
      error: error.message
    });
  }
});

// @route   PUT /api/reports/:id
// @desc    Update report
// @access  Public
router.put('/:id', validateReportUpdate, handleValidationErrors, async (req, res) => {
  try {
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { 
        new: true, 
        runValidators: true 
      }
    ).populate('user', 'name email profileImage')
     .populate('doctor', 'name specialization clinic.name')
     .populate('appointment', 'appointmentDate type reason');

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Report updated successfully',
      data: report
    });
  } catch (error) {
    console.error('Error updating report:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid report ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error updating report',
      error: error.message
    });
  }
});

// @route   DELETE /api/reports/:id
// @desc    Delete report
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Report deleted successfully',
      data: report
    });
  } catch (error) {
    console.error('Error deleting report:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid report ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error deleting report',
      error: error.message
    });
  }
});

// @route   GET /api/reports/user/:userId/summary
// @desc    Get user's reports summary and statistics
// @access  Public
router.get('/user/:userId/summary', async (req, res) => {
  try {
    const userId = req.params.userId;
    const dateFrom = req.query.dateFrom;
    const dateTo = req.query.dateTo;

    // Build date query
    let dateQuery = {};
    if (dateFrom || dateTo) {
      dateQuery.reportDate = {};
      if (dateFrom) dateQuery.reportDate.$gte = new Date(dateFrom);
      if (dateTo) dateQuery.reportDate.$lte = new Date(dateTo);
    }

    const reports = await Report.find({
      user: userId,
      ...dateQuery
    });

    if (reports.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          totalReports: 0,
          reportsByType: {},
          reportsByStatus: {},
          abnormalResults: 0,
          criticalFindings: 0,
          recentReports: []
        }
      });
    }

    // Calculate statistics
    const totalReports = reports.length;

    // Reports by type
    const reportsByType = reports.reduce((acc, report) => {
      acc[report.type] = (acc[report.type] || 0) + 1;
      return acc;
    }, {});

    // Reports by status
    const reportsByStatus = reports.reduce((acc, report) => {
      acc[report.status] = (acc[report.status] || 0) + 1;
      return acc;
    }, {});

    // Count abnormal results and critical findings
    const abnormalResults = reports.reduce((count, report) => {
      return count + (report.abnormalResultsCount || 0);
    }, 0);

    const criticalFindings = reports.reduce((count, report) => {
      return count + (report.criticalFindingsCount || 0);
    }, 0);

    // Get recent reports (last 5)
    const recentReports = reports
      .sort((a, b) => new Date(b.reportDate) - new Date(a.reportDate))
      .slice(0, 5)
      .map(report => ({
        _id: report._id,
        title: report.title,
        type: report.type,
        reportDate: report.reportDate,
        status: report.status,
        overallStatus: report.overallStatus
      }));

    // Health trends (basic analysis)
    const healthTrends = {
      improving: reports.filter(r => r.overallStatus === 'normal').length,
      concerning: reports.filter(r => r.overallStatus === 'abnormal').length,
      critical: reports.filter(r => r.overallStatus === 'critical').length
    };

    const summary = {
      totalReports,
      reportsByType,
      reportsByStatus,
      abnormalResults,
      criticalFindings,
      recentReports,
      healthTrends
    };

    res.status(200).json({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error('Error fetching report summary:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error fetching report summary',
      error: error.message
    });
  }
});

// @route   PUT /api/reports/:id/review
// @desc    Review and approve report
// @access  Public
router.put('/:id/review', async (req, res) => {
  try {
    const { doctorId, approved, reviewNotes } = req.body;

    if (!doctorId) {
      return res.status(400).json({
        success: false,
        message: 'Doctor ID is required for review'
      });
    }

    const report = await Report.findByIdAndUpdate(
      req.params.id,
      {
        status: approved ? 'reviewed' : 'pending_review',
        'reviewedBy.doctor': doctorId,
        'reviewedBy.reviewDate': new Date(),
        'reviewedBy.reviewNotes': reviewNotes || '',
        'reviewedBy.approved': approved || false
      },
      { new: true, runValidators: true }
    ).populate('reviewedBy.doctor', 'name specialization');

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    res.status(200).json({
      success: true,
      message: `Report ${approved ? 'approved' : 'marked for revision'}`,
      data: report
    });
  } catch (error) {
    console.error('Error reviewing report:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid report ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error reviewing report',
      error: error.message
    });
  }
});

// @route   GET /api/reports/search
// @desc    Search reports by text
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const { q, user, limit = 10, page = 1 } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    let query = { $text: { $search: q } };
    if (user) {
      query.user = user;
    }

    const reports = await Report.find(query, { score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('user', 'name email')
      .populate('doctor', 'name specialization');

    const total = await Report.countDocuments(query);

    res.status(200).json({
      success: true,
      data: reports,
      total,
      query: q
    });
  } catch (error) {
    console.error('Error searching reports:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching reports',
      error: error.message
    });
  }
});

// @route   GET /api/reports/types
// @desc    Get all available report types and categories
// @access  Public
router.get('/types', (req, res) => {
  const reportTypes = [
    'medical_report', 'lab_result', 'imaging_report', 'pathology_report',
    'fitness_report', 'nutrition_report', 'mental_health_report',
    'prescription', 'discharge_summary', 'referral_letter',
    'insurance_claim', 'fitness_assessment', 'other'
  ];

  const categories = [
    'blood_work', 'urine_analysis', 'x_ray', 'mri', 'ct_scan',
    'ultrasound', 'ecg', 'echo', 'biopsy', 'allergy_test',
    'fitness_test', 'body_composition', 'cardiovascular',
    'respiratory', 'neurological', 'orthopedic', 'dermatological',
    'psychological', 'nutritional', 'other'
  ];

  res.status(200).json({
    success: true,
    data: {
      types: reportTypes,
      categories: categories
    }
  });
});

module.exports = router;
