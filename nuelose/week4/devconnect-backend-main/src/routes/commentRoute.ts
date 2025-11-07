import { Router } from "express";
import requireAuth from "../middleware/auth.js";
import {
  createComment,
  deleteComment,
  getCommentByProject,
} from "../controllers/commentController.js";

const router = Router();

router.post("/:projectId", requireAuth, createComment);
router.delete("/:id", requireAuth, deleteComment);
router.get("/:projectId", getCommentByProject);

export default router;
