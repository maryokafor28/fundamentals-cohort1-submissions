import express from "express";
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getUserProfile
} from "../controllers/mainController";
import {
  addComment,
  getCommentsForProject,
  deleteComment
} from "../controllers/commentController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.route("/projects").post(protect, createProject).get(getProjects);

router
  .route("/projects/:id")
  .get(getProjectById)
  .put(protect, updateProject)
  .delete(protect, deleteProject);

router.route("/users/:username").get(getUserProfile);

// Comment Routes
router
  .route("/projects/:projectId/comments")
  .post(protect, addComment)
  .get(getCommentsForProject);

router
  .route("/comments/:commentId")
  .delete(protect, deleteComment);

export default router;
