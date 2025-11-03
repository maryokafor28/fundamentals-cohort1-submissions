import { Router } from "express";
import { getUserProfile, updateUserProfile } from "../controllers/userController.js";
import requireAuth from "../middleware/auth.js";

const router = Router()

router.get("/:id", getUserProfile);
router.post('/:id', requireAuth ,updateUserProfile);

export default router
