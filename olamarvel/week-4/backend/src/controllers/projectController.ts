import { Request, Response } from 'express';
import {asyncHandler} from '../middleware/asyncWrapper';
import Project, { IProject } from '../models/projectModel';
import User, { IUser } from '../models/userModel';
import Comment, { IComment } from '../models/commentModel';
import { HydratedDocument, Types } from 'mongoose';

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
export const createProject = asyncHandler(async (req: Request, res: Response) => {
  const { title, description } = req.body;

  if (!title || !description) {
    res.status(400).json({ message: 'Please add all fields' });
    return;
  }

  const project: HydratedDocument<IProject> = new Project({
    title,
    description,
    owner: req.user?.id,
  });

  const createdProject = await project.save();

  // Add project to user's projects array
  const user = await User.findById(req.user?.id);
  if (user) {
    user.projects.push(createdProject._id as Types.ObjectId);
    await user.save();
  }

  res.status(201).json(createdProject);
});

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
export const getProjects = asyncHandler(async (req: Request, res: Response) => {
  const projects = await Project.find({})
    .populate<{ owner: IUser }>('owner', 'username email')
    .populate<{ comments: IComment[] }>('comments');
  res.status(200).json(projects);
});

// @desc    Get a single project by ID
// @route   GET /api/projects/:id
// @access  Public
export const getProjectById = asyncHandler(async (req: Request, res: Response) => {
  if (!req.params.id || !Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Invalid project ID' });
    return;
  }
  const project = await Project.findById(req.params.id)
    .populate<{ owner: IUser }>('owner', 'username email')
    .populate<{ comments: IComment[] }>({
      path: 'comments',
      populate: { path: 'user', select: 'username' },
    });

  if (!project) {
    res.status(404).json({ message: 'Project not found' });
    return;
  }

  res.status(200).json(project);
});

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private (Owner or Collaborator)
export const updateProject = asyncHandler(async (req: Request, res: Response) => {
  const { title, description } = req.body;

  let project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404).json({ message: 'Project not found' });
    return;
  }

  // Check if user is owner or collaborator
  if (project.owner.toString() !== req.user?.id && !project.collaborators.includes(req.user?.id as any)) {
    res.status(403).json({ message: 'Not authorized to update this project' });
    return;
  }

  project.title = title || project.title;
  project.description = description || project.description;

  const updatedProject = await project.save();
  res.status(200).json(updatedProject);
});

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private (Owner)
export const deleteProject = asyncHandler(async (req: Request, res: Response) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404).json({ message: 'Project not found' });
    return;
  }

  // Check if user is owner
  if (project.owner.toString() !== req.user?.id) {
    res.status(403).json({ message: 'Not authorized to delete this project' });
    return;
  }

  await project.deleteOne();

  // Remove project from user's projects array
  const user = await User.findById(req.user?.id);
  if (user) {
    user.projects = user.projects.filter(projId => projId.toString() !== req.params.id);
    await user.save();
  }

  res.status(200).json({ message: 'Project removed' });
});

// @desc    Add a collaborator to a project
// @route   PUT /api/projects/:id/collaborators
// @access  Private (Owner)
export const addCollaborator = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.body;

  let project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404).json({ message: 'Project not found' });
    return;
  }

  if (project.owner.toString() !== req.user?.id) {
    res.status(403).json({ message: 'Not authorized to add collaborators to this project' });
    return;
  }

  const userToAdd = await User.findById(userId);

  if (!userToAdd) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  if (project.collaborators.includes(userId)) {
    res.status(400).json({ message: 'User is already a collaborator' });
    return;
  }

  project.collaborators.push(userId);
  await project.save();

  res.status(200).json({ message: 'Collaborator added', project });
});