import express from 'express';
import {
  getReports,
  getUserReports,
  getReportById,
  generateReport,
  updateReport,
  deleteReport
} from '../controllers/reportController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Admin can see all reports
router.get('/', authenticate, authorize('admin'), getReports);

// Get user's reports (patients see their own, doctors can specify userId)
router.get('/user/:userId?', authenticate, getUserReports);

// Get specific report
router.get('/:id', authenticate, getReportById);

// Generate report (doctors only)
router.post('/generate', authenticate, authorize('doctor'), generateReport);

// Update report (doctors only)
router.put('/:id', authenticate, authorize('doctor'), updateReport);

// Delete report (admin only)
router.delete('/:id', authenticate, authorize('admin'), deleteReport);

export default router;