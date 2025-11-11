// src/controllers/commentController.ts
import { Request, Response } from "express";
import mongoose from "mongoose";
import Comment from "../models/comment";
import Project from "../models/project";

/**
 * Add a new comment
 */
export async function addComment(req: Request, res: Response) {
  try {
    const { text } = req.body;
    const { projectId } = req.params; // Get from URL params instead
    const user = req.user;

    if (!user?._id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const comment = await Comment.create({
      text: text.trim(),
      projectId,
      userId: user._id,
    });

    // Populate user info before returning
    await comment.populate("userId", "name email");

    return res.status(201).json({
      message: "Comment added successfully",
      comment,
    });
  } catch (error: any) {
    console.error("Error adding comment:", error.message);
    res.status(500).json({
      message: "Server error while adding comment",
      ...(process.env.NODE_ENV === "development" && { error: error.message }),
    });
  }
}

/**
 * Get all comments for a specific project
 */
export async function getComments(req: Request, res: Response) {
  try {
    const { projectId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    const comments = await Comment.find({ projectId })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ comments });
  } catch (error: any) {
    console.error("Error fetching comments:", error.message);
    res.status(500).json({
      message: "Server error while fetching comments",
      ...(process.env.NODE_ENV === "development" && { error: error.message }),
    });
  }
}

/**
 * Update a comment
 */
export async function updateComment(req: Request, res: Response) {
  try {
    const { commentId } = req.params;
    const { text } = req.body;
    const user = req.user;

    if (!user?._id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ message: "Invalid comment ID" });
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check ownership
    if (comment.userId.toString() !== user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this comment" });
    }

    comment.text = text.trim();
    await comment.save();
    await comment.populate("userId", "name email");

    res.json({ comment });
  } catch (error: any) {
    console.error("Error updating comment:", error.message);
    res.status(500).json({
      message: "Server error while updating comment",
      ...(process.env.NODE_ENV === "development" && { error: error.message }),
    });
  }
}

/**
 * Delete a comment
 */
export async function deleteComment(req: Request, res: Response) {
  try {
    const { commentId } = req.params;
    const user = req.user;

    if (!user?._id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ message: "Invalid comment ID" });
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check ownership
    if (comment.userId.toString() !== user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this comment" });
    }

    await comment.deleteOne();

    res.json({ message: "Comment deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting comment:", error.message);
    res.status(500).json({
      message: "Server error while deleting comment",
      ...(process.env.NODE_ENV === "development" && { error: error.message }),
    });
  }
}
