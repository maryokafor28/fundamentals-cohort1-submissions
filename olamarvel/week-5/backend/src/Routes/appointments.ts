import { Router } from "express";
import * as appointments from "../Controllers/appointments";
import { protect } from "../Middlewares/protect";
import { body } from "express-validator";
import asyncHandler from "../Middlewares/aysncHandler";

const router = Router();
const status = ["scheduled" , "completed" , "cancelled"]

router.post("/", [
    protect,
    body("time", "time is required").exists().isISO8601(),
    body("doctor", "doctor is required").exists().isMongoId(),
    body("notes", "notes is required").optional().isLength({ min: 10 }),
    body("status","Invalid activity type").isIn(status)], 
    asyncHandler(appointments.createAppointment));
router.get("/", protect, asyncHandler(appointments.getAppointments));
router.get("/:id", protect, asyncHandler(appointments.getAppointment));

export default router;