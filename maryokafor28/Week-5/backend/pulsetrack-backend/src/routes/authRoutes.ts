import express from "express";
import {
  signup,
  signin,
  getMe,
  deleteAllUsers,
} from "../controllers/authController";
import { protect } from "../middleware/auth";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/me", protect, getMe);

// ⚠️ DANGEROUS: Only for development/testing
router.post("/delete-all-users", deleteAllUsers);

export default router;
