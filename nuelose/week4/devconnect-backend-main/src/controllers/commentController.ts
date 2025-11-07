import { AuthRequest } from "../middleware/auth.js";
import { Response } from "express";
import Project from "../models/Project.js";
import Comment from "../models/Comment.js";

export const createComment = async (req: AuthRequest, res: Response) => {
  try {
    const { text } = req.body;
    const projectId = req.params.projectId;

    if (!text) return res.status(400).json({ message: "Missing Comment" });

    const project = await Project.findById(projectId);
    if (!project)
      return res.status(400).json({ message: "Project Doesnot exist" });

    const comment = await Comment.create({
      text,
      author: req.user.id,
      project: projectId,
    });

    const populatedComment = await comment.populate("author", "name email");
    res.status(201).json(populatedComment);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Server Errror", error: error.message });
  }
};

export const getCommentByProject = async (req: AuthRequest, res: Response) => {
  try {
    const projectId = req.params.projectId;
    const comments = await Comment.find({ project: projectId })
      .populate("author", "name email avatar")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export const deleteComment = async (req: AuthRequest, res: Response) => {
  try {
    const commentId = req.params.id;
    const comment = await Comment.findById(commentId);

    if (!comment) return res.status(404).json({ message: "Comment not found" });
    if (comment.author.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    await comment.deleteOne();
    res.status(200).json({ message: "Comment deleted" });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Server error", error: error.message || error });
  }
};
