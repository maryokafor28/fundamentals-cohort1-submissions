import express from "express";
import {
  addComment,
  getComments,
  updateComment,
  deleteComment,
} from "../controllers/commentController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

// ✅ Add a new comment to a project (protected)
router.post("/:projectId", protect, addComment);

// ✅ Get all comments for a specific project (public)
router.get("/:projectId", getComments);

// ✅ Update a comment (protected)
router.put("/:commentId", protect, updateComment);

// ✅ Delete a comment (protected)
router.delete("/:commentId", protect, deleteComment);

export default router;
