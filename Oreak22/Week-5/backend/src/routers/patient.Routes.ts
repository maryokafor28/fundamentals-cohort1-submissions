import express from "express";
import { authenticate } from "../middlewares/auth.middleware";
import {
  createPatient,
  deletePatient,
  getPatient,
  getPatientById,
  updatePatient,
} from "../controllers/patient.controller";

const router = express.Router();

router.post("/createpatient", authenticate, createPatient);
router.get("/getpatient", authenticate, getPatient);
router.get("/:id", authenticate, getPatientById);
router.put("/update/:id", authenticate, updatePatient);
router.delete("/delete/:id", authenticate, deletePatient);

export default router;
