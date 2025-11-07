import express from "express";
import {
  createReport,
  getReports,
  getReportsByUser,
  updateReport,
  deleteReport,
} from "../controllers/reportController";

const router = express.Router();

router.post("/", createReport);
router.get("/", getReports);
router.get("/user/:userId", getReportsByUser);
router.put("/:id", updateReport);
router.delete("/:id", deleteReport);

export default router;
