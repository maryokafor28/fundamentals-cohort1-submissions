import Report from '../models/Report.js';
import User from '../models/User.js';
import Activity from '../models/Activity.js';
import Meal from '../models/Meal.js';

// Get all reports (Admin only)
export const getReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('user', 'name email')
      .populate('generatedBy', 'name specialization')
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get reports by user (Patient can see their own reports)
export const getUserReports = async (req, res) => {
  try {
    const userId = req.user.role === 'patient' ? req.user.profile._id : req.params.userId;
    const reports = await Report.find({ user: userId })
      .populate('generatedBy', 'name specialization')
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get report by ID
export const getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('user', 'name email age height weight')
      .populate('generatedBy', 'name specialization');
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Generate report (Doctor only)
export const generateReport = async (req, res) => {
  try {
    const { userId, reportType, startDate, endDate, findings, diagnosis, prescriptions, testResults } = req.body;
    
    if (!userId || !reportType) {
      return res.status(400).json({ message: 'userId and reportType are required' });
    }
    
    const doctorId = req.user.profile._id;
    
    // Calculate activity and meal data for the period
    const activities = await Activity.find({
      user: userId,
      createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
    });
    
    const meals = await Meal.find({
      user: userId,
      createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
    });
    
    const totalActivities = activities.length;
    const totalCaloriesBurned = activities.reduce((sum, activity) => sum + (activity.caloriesBurned || 0), 0);
    const totalCaloriesConsumed = meals.reduce((sum, meal) => sum + (meal.calories || 0), 0);
    
    const report = new Report({
      user: userId,
      generatedBy: doctorId,
      title: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`,
      reportType,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      totalActivities,
      totalCaloriesBurned,
      totalCaloriesConsumed,
      findings: findings || {},
      diagnosis: diagnosis || {},
      prescriptions: prescriptions || [],
      testResults: testResults || [],
      summary: `Report generated for period ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}. Total activities: ${totalActivities}, Calories burned: ${totalCaloriesBurned}, Calories consumed: ${totalCaloriesConsumed}`
    });
    
    const savedReport = await report.save();
    await User.findByIdAndUpdate(userId, { $push: { reports: savedReport._id } });
    
    res.status(201).json(savedReport);
  } catch (error) {
    console.error('Report generation error:', error);
    res.status(400).json({ message: error.message });
  }
};

// Update report (Doctor only)
export const updateReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    
    // Only the doctor who generated the report can update it
    if (report.generatedBy.toString() !== req.user.profile._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this report' });
    }
    
    const updatedReport = await Report.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedReport);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete report
export const deleteReport = async (req, res) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    
    // Remove report from user's reports array
    await User.findByIdAndUpdate(report.user, {
      $pull: { reports: report._id }
    });
    
    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};