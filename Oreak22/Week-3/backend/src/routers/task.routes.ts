import express from "express";

import { authenticate } from "../middlewares/auth.middleware";
import {
  deletTask,
  filter,
  getTask,
  newTask,
  search,
} from "../controllers/task.Controller";
import { authorizeAdmin } from "../middlewares/role.middleware";

const router = express.Router();

router.post("/new", authenticate, newTask);
router.get("/getTask", authenticate, getTask);
router.delete("/deletetask/:id", authenticate, authorizeAdmin, deletTask);
router.get("/search", authenticate, search);
router.get("/filter", authenticate, filter);

export default router;
