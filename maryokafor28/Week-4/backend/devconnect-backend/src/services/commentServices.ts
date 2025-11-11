// src/services/commentService.ts
import Comment, { IComment } from "../models/comment";
import { Types } from "mongoose";

/**
 * Create a new comment for a project
 */
export async function createComment(
  text: string,
  projectId: Types.ObjectId,
  userId: Types.ObjectId
): Promise<IComment> {
  const comment = await Comment.create({
    text,
    projectId,
    userId,
  });
  return comment;
}

/**
 * Get all comments for a project
 */
export async function getCommentsByProject(
  projectId: Types.ObjectId
): Promise<IComment[]> {
  return Comment.find({ projectId })
    .populate("userId", "name email") // show user info
    .sort({ createdAt: -1 }); // newest first
}
