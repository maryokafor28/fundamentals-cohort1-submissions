import express from "express";
import {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
} from "../controllers/appointment.Controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/", authenticate, createAppointment);
router.get("/", authenticate, getAppointments);
router.get("/:id", authenticate, getAppointmentById);
router.put("/:id", authenticate, updateAppointment);
router.delete("/:id", authenticate, deleteAppointment);

export default router;
