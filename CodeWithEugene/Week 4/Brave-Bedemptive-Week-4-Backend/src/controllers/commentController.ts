import { Request, Response } from "express";
import Comment from "../models/Comment";
import Project from "../models/Project";

export const addComment = async (req: Request, res: Response) => {
  try {
    const { body } = req.body;
    const projectId = req.params.projectId;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const comment = new Comment({
      body,
      author: (req as any).user.id,
      project: projectId
    });

    await comment.save();

    res.status(201).json(comment);
  } catch (error: any) {
    res.status(400).json({ message: "Error adding comment", error: error.message });
  }
};

export const getCommentsForProject = async (req: Request, res: Response) => {
  try {
    const comments = await Comment.find({ project: req.params.projectId })
      .populate("author", "username avatarUrl")
      .sort({ createdAt: "desc" });
    res.status(200).json(comments);
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching comments", error: error.message });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.author.toString() !== (req as any).user.id) {
      return res.status(403).json({ message: "User not authorized" });
    }

    await Comment.findByIdAndDelete(req.params.commentId);

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: "Error deleting comment", error: error.message });
  }
};
