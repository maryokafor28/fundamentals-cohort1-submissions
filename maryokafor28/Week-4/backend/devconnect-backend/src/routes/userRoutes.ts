// src/routes/userRoutes.ts
import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  getUserById,
} from "../controllers/userController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

// Private (self)
router.get("/me", protect, getUserProfile);
router.put("/me", protect, updateUserProfile);

// Public (view others)
router.get("/:id", getUserById);

export default router;
