import express from "express";
import {
  createPrescription,
  getAllPrescriptions,
  getPrescriptionById,
  updatePrescription,
  deletePrescription,
} from "../controllers/prescription.Controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/", authenticate, createPrescription);
router.get("/", authenticate, getAllPrescriptions);
router.get("/:id", authenticate, getPrescriptionById);
router.put("/:id", authenticate, updatePrescription);
router.delete("/:id", authenticate, deletePrescription);

export default router;
