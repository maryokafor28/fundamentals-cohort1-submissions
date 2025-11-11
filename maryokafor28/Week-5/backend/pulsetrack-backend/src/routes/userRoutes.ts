import express from "express";
import { protect } from "../middleware/auth";
import * as userController from "../controllers/userController";

const router = express.Router();

// ✅ Specific routes FIRST
router.get("/", protect, userController.getAllUsersController);

// ✅ Then parameterized routes
router.get("/:id", protect, userController.getMe);
router.put("/:id", protect, userController.updateMe);
router.delete("/:id", protect, userController.deleteMe);

export default router;
