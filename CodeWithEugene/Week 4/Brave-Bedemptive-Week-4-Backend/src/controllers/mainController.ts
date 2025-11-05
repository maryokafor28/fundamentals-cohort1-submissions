import { Request, Response } from "express";
import Project from "../models/Project";
import User from "../models/User";

export const createProject = async (req: Request, res: Response) => {
  try {
    const project = new Project({
      ...req.body,
      author: (req as any).user.id
    });
    await project.save();
    res.status(201).json(project);
  } catch (error: any) {
    res.status(400).json({ message: "Error creating project", error: error.message });
  }
};

export const getProjects = async (req: Request, res: Response) => {
  const { page = 1, pageSize = 10, status, query } = req.query;
  const pageNum = parseInt(page as string, 10);
  const sizeNum = parseInt(pageSize as string, 10);

  const filter: any = {};
  if (status) {
    filter.status = status;
  }
  if (query) {
    filter.$text = { $search: query as string };
  }

  try {
    const projects = await Project.find(filter)
      .populate("author", "username avatarUrl")
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * sizeNum)
      .limit(sizeNum);

    const total = await Project.countDocuments(filter);

    res.status(200).json({
      items: projects,
      page: pageNum,
      pageSize: sizeNum,
      total
    });
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching projects", error: error.message });
  }
};

export const getProjectById = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id).populate(
      "author",
      "username avatarUrl"
    );
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json(project);
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching project", error: error.message });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.author.toString() !== (req as any).user.id) {
      return res.status(403).json({ message: "User not authorized" });
    }

    const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    res.status(200).json(updatedProject);
  } catch (error: any) {
    res.status(400).json({ message: "Error updating project", error: error.message });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.author.toString() !== (req as any).user.id) {
      return res.status(403).json({ message: "User not authorized" });
    }

    await Project.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Project deleted" });
  } catch (error: any) {
    res.status(500).json({ message: "Error deleting project", error: error.message });
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const projects = await Project.find({ author: user._id }).sort({ createdAt: -1 });

    // This is a placeholder for collaborations
    const collaborations: any[] = [];

    res.status(200).json({
      user,
      projects,
      collaborations
    });
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching user profile", error: error.message });
  }
};
