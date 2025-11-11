// src/routes/projectRoutes.ts
import express from "express";
import * as projectController from "../controllers/projectController";
import { protect } from "../middlewares/authMiddleware";
import commentRoutes from "./commentRoutes"; // Add this import

const router = express.Router();

// Public routes
router.get("/", projectController.getAllProjects);
router.get("/:id", projectController.getProjectById);

// Protected routes
router.post("/", protect, projectController.createProject);
router.put("/:id", protect, projectController.updateProject);
router.delete("/:id", protect, projectController.deleteProject);

// Mount comment routes under projects
router.use("/:projectId/comments", commentRoutes);

export default router;
