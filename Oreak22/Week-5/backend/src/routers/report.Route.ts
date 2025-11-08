import express from "express";
import {
  createReportStudy,
  getAllReportStudies,
  getReportStudyById,
  updateReportStudy,
  deleteReportStudy,
} from "../controllers/report.Controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/", authenticate, createReportStudy);
router.get("/", authenticate, getAllReportStudies);
router.get("/:id", authenticate, getReportStudyById);
router.put("/:id", authenticate, updateReportStudy);
router.delete("/:id", authenticate, deleteReportStudy);

export default router;
