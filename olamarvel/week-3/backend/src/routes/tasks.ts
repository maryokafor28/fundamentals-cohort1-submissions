
import { Router } from "express";
import { asyncWrapper } from "../middleware/asyncWrapper";
import { authMiddleware, requireRole } from "../middleware/authMiddleware";
import {
  listTasks,
  createTask,
  deleteTask,
  searchTasks,
  filterTasks,
} from "../controllers/tasksController";

const router = Router();

router.use(authMiddleware);

router.get("/", asyncWrapper(listTasks));

router.post("/", asyncWrapper(createTask));

router.delete("/:id", requireRole("admin"), asyncWrapper(deleteTask));

router.post("/search", asyncWrapper(searchTasks));

router.post("/filter", asyncWrapper(filterTasks));

export default router;
