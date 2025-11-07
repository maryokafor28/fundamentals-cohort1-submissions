import { Request, Response, NextFunction } from "express";
import { Comment } from "../models/comment";
import { Project } from "../models/project";
import AppError from "../utils/AppError";
import { securityLoggerInstance } from "../utils/loggers";

// create comment
export const createComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.id;
    const { projectId } = req.params;
    const { text } = req.body;

    if (!text) return next(new AppError("Comment text is required", 400));

    const project = await Project.findById(projectId);
    if (!project) return next(new AppError("Project not found", 404));

    const comment = await Comment.create({
      text: text.trim(),
      author: userId,
      project: projectId,
    });

    res.status(201).json({
      status: "success",
      message: "Comment added successfully",
      data: comment,
    });
  } catch (err) {
    next(err);
  }
};

// get comment for project
export const getCommentsForProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { projectId } = req.params;

    const comments = await Comment.find({ project: projectId })
      .populate("author", "name avatar github LinkedIn")
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      count: comments.length,
      data: comments,
    });
  } catch (err) {
    next(err);
  }
};

// update comment
export const updateComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const { text } = req.body;

    const comment = await Comment.findById(id);
    if (!comment) return next(new AppError("Comment not found", 404));

    if (comment.author._id.toString() !== userId.toString()) {
      securityLoggerInstance.warn("UNAUTHORIZED_EDIT_COMMENT", {
        userId,
        ip: req.ip,
        commentId: comment.id,
      });
      return next(
        new AppError("You are not authorized to edit this comment", 403)
      );
    }

    if (text) comment.text = text.trim();

    await comment.save();

    res.status(200).json({
      status: "success",
      message: "Comment updated successfully",
      data: comment,
    });
  } catch (err) {
    next(err);
  }
};

// delete comment
export const deleteComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const comment = await Comment.findById(id);
    if (!comment) return next(new AppError("Comment not found", 404));

    if (comment.author._id.toString() !== userId.toString()) {
      securityLoggerInstance.warn("UNAUTHORIZED_DELETE_COMMENT", {
        userId,
        ip: req.ip,
        commentId: comment.id,
      });
      return next(
        new AppError("You are not authorized to delete this comment", 403)
      );
    }

    await comment.deleteOne();

    res.status(200).json({
      status: "success",
      message: "Comment deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
