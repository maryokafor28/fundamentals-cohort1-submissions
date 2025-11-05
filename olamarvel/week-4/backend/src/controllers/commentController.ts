import { Request, Response } from 'express';
import {asyncHandler} from '../middleware/asyncWrapper';
import Project from '../models/projectModel';
import Comment, { IComment } from '../models/commentModel';
import { HydratedDocument, Types } from 'mongoose';
 

export const addComment = asyncHandler(async (req: Request, res: Response) => {
  const { content } = req.body;

  if (!content) {
    res.status(400).json({ message: 'Please add content to your comment' });
    return;
  }

  let project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404).json({ message: 'Project not found' });
    return;
  }

  const comment: HydratedDocument<IComment> = new Comment({
    user: req.user?.id,
    project: req.params.id,
    content,
  });

  const createdComment = await comment.save();

  project.comments.push(createdComment._id as Types.ObjectId);
  await project.save();

  res.status(201).json(createdComment);
});


export const deleteComment = asyncHandler(async (req: Request, res: Response) => {
  const { commentId } = req.params;

  const comment = await Comment.findById(commentId);

  if (!comment) {
    res.status(404).json({ message: 'Comment not found' });
    return;
  }

  // Check if user is the comment owner
  if (comment.user.toString() !== req.user?.id) {
    res.status(403).json({ message: 'Not authorized to delete this comment' });
    return;
  }

  await comment.deleteOne();

  // Remove comment from project's comments array
  let project = await Project.findById(req.params.id);
  if (project) {
    project.comments = project.comments.filter(
      comment => comment.toString() !== commentId
    );
    await project.save();
  }

  res.status(200).json({ message: 'Comment removed' });
});