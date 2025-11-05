import { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import {
  getUserProfile,
  updateUserProfile,
  getAllProfiles,
} from '../controllers/profileController';

const router = Router();

router.route('/').get(getAllProfiles).put(protect, updateUserProfile);
router.route('/:userId').get(getUserProfile);

export default router;