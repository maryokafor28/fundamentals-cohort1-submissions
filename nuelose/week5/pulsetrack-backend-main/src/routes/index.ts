import express from "express";
import userRoutes from "./userRoutes.js";
import activityRoutes from "./activityRoutes.js";
import mealRoutes from "./mealRoutes.js";
import doctorRoutes from "./doctorRoutes.js";
import appointmentRoutes from "./appointmentRoutes.js";
import reportRoutes from "./reportRoutes.js";

const router = express.Router();

router.use("/users", userRoutes);
router.use("/activities", activityRoutes);
router.use("/meals", mealRoutes);
router.use("/doctors", doctorRoutes);
router.use("/appointments", appointmentRoutes);
router.use("/reports", reportRoutes);

export default router;
