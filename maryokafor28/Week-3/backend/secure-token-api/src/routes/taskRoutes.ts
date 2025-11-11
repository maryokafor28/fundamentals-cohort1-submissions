import express from "express";
import { authenticate } from "../middleware/authMiddleware";
import { authorize } from "../middleware/roleMiddleware";
import {
  getTasks,
  createTask,
  deleteTask,
  searchTasks,
  filterTasks,
} from "../controllers/taskController";

const router = express.Router();

// GET and POST -> User + Admin
router.get("/", authenticate, authorize(["user", "admin"]), getTasks);
router.post("/", authenticate, authorize(["user", "admin"]), createTask);

// DELETE -> Admin only
router.delete("/:id", authenticate, authorize(["admin"]), deleteTask);

// search and filter

router.post("/search", authenticate, authorize(["user", "admin"]), searchTasks);
router.post("/filter", authenticate, authorize(["user", "admin"]), filterTasks);

export default router;
