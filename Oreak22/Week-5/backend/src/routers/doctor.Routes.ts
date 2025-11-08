import express from "express";
import {
  getDoctors,
  getProfile,
  updateProfile,
} from "../controllers/doctor.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/getDoctor", authenticate, getDoctors);
router.get("/:_id", authenticate, getProfile);
router.put("/update/:id", authenticate, updateProfile);
export default router;
