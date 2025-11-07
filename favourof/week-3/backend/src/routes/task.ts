import express from "express";
import { verifyAccessToken } from "../middleware/verifyAccessToken";
import {
  getTasks,
  createTask,
  deleteTask,
} from "../controllers/taskController";
import { requiredRole } from "../middleware/requireRole";

const router = express.Router();

router.get("/", verifyAccessToken, getTasks);
router.post("/", verifyAccessToken, createTask);
router.delete("/:id", verifyAccessToken, requiredRole("admin"), deleteTask);

export default router;
