import express from "express";
import {
  register,
  login,
  logout,
  refresh,
  getMe,
} from "../controllers/authController";
import { protect } from "../middlewares/authMiddleware";
const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refresh);
router.get("/me", protect, getMe);

export default router;
