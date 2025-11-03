import { Router } from "express";
import { createProject, deleteProject, getAllProject, getProjectById, getProjectsByUserId, toggleLike, updateProject } from "../controllers/projectController.js";
import requireAuth from "../middleware/auth.js";

const router = Router()

router.get("/", getAllProject);
router.post("/", requireAuth, createProject);
router.get("/:id", requireAuth, getProjectById)
router.get("/user/:id", requireAuth, getProjectsByUserId);
router.put("/:id", requireAuth, updateProject);
router.delete("/:id", requireAuth, deleteProject);
router.post("/:id/like", requireAuth, toggleLike);


export default router
