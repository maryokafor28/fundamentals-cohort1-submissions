import express from "express";
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  toggleLikeProject,
} from "../controllers/projectController";
import { verifyAccessToken } from "../middlewares/verifyAccessToken";
import validateRequest from "../middlewares/validateRequest";
import {
  createProjectValidation,
  updateProjectValidation,
} from "../validators/projectValidation";

const router = express.Router();

router.get("/", getAllProjects);
router.get("/:id", getProjectById);
router.post(
  "/create",
  verifyAccessToken,
  validateRequest(createProjectValidation),
  createProject
);
router.patch(
  "/update/:id",
  verifyAccessToken,
  validateRequest(updateProjectValidation),
  updateProject
);
router.delete("/delete/:id", verifyAccessToken, deleteProject);
router.patch("/like/:id", verifyAccessToken, toggleLikeProject);

export default router;
