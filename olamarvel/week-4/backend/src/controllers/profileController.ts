import { Request, Response } from 'express';
import {asyncHandler} from '../middleware/asyncWrapper';
import User, { IUser } from '../models/userModel';
import Project, { IProject } from '../models/projectModel';
import Comment, { IComment } from '../models/commentModel';
import { HydratedDocument } from 'mongoose';
  
// @desc    Get user profile
// @route   GET /api/profile/:userId
// @access  Public
export const getUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.userId)
    .select('-passwordHash -refreshTokens')
    .populate<{ projects: IProject[] }>('projects', 'title description');

  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  res.status(200).json(user);
});

// @desc    Update user profile
// @route   PUT /api/profile
// @access  Private
export const updateUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const { username, bio, profilePicture } = req.body;
  const user = await User.findById(req.user?.id);

  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  user.username = username || user.username;
  user.bio = bio || user.bio;
  user.profilePicture = profilePicture || user.profilePicture;

  const updatedUser = await user.save();

  res.status(200).json({
    _id: updatedUser._id,
    username: updatedUser.username,
    email: updatedUser.email,
    bio: updatedUser.bio,
    profilePicture: updatedUser.profilePicture,
    projects: updatedUser.projects,
  });
});

// @desc    Get all users (for discovery)
// @route   GET /api/profile
// @access  Public
export const getAllProfiles = asyncHandler(async (req: Request, res: Response) => {
  const users = await User.find({}).select('-passwordHash -refreshTokens');
  res.status(200).json(users);
});