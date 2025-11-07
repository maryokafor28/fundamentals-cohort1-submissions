import express from 'express';
import { 
  getAdminDashboard, 
  getDoctorDashboard, 
  getPatientDashboard,
  assignDoctorToPatient,
  assignActivityToPatient,
  assignMealToPatient
} from '../controllers/dashboardController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.get('/admin', authorize('admin'), getAdminDashboard);
router.get('/doctor', authorize('doctor'), getDoctorDashboard);
router.get('/patient', authorize('patient'), getPatientDashboard);

router.post('/assign-doctor', authorize('admin'), assignDoctorToPatient);
router.post('/assign-activity', authorize('doctor'), assignActivityToPatient);
router.post('/assign-meal', authorize('doctor'), assignMealToPatient);

export default router;