import { Request, Response } from "express";
import Project from "../models/Project.js";
import { AuthRequest } from "../middleware/auth.js";

export const createProject = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, techStack } = req.body;
    const project = await Project.create({
      title,
      description,
      techStack,
      author: req.user.id,
    });
    res.status(201).json(project);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Server error ", error: error.message || error });
  }
};

export const getAllProject = async (req: Request, res: Response) => {
  try {
    const project = await Project.find()
      .populate("author", "name email avatar techStack")
      .sort({ createdAt: -1 });

    return res.status(200).json(project);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message || error });
  }
};

export const getProjectById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ message: "Missing Project id" });

    const project = await Project.findById(id).populate(
      "author",
      "name email techStack"
    );
    if (!project)
      return res
        .status(400)
        .json({ message: `Project with id: ${id} does not exist` });

    res.status(200).json(project);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Server Error", error: error.message || error });
  }
};

export const getProjectsByUserId = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({ message: "Missing User ID" });
    }

    const projects = await Project.find({ author: userId })
      .populate("author", "name email techStack")
      .sort({ createdAt: -1 });

    if (!projects.length) {
      return res.status(404).json({
        message: `No projects found for user with id: ${userId}`,
      });
    }

    return res.status(200).json(projects);
  } catch (error: any) {
    console.error("Error fetching user projects:", error);
    return res.status(500).json({
      message: "Server Error",
      error: error.message || error,
    });
  }
};


export const updateProject = async (req: AuthRequest, res: Response) => {
  try {
    const projectId = req.params.id;
    if (!projectId)
      return res.status(400).json({ message: "User does not exist" });
    const projectAuthor = await Project.findById(projectId).select("author");
    if (!projectAuthor)
      return res.status(400).json({ message: "Project not found" });
    const isProjectAuthor = projectAuthor.author.toString() === req.user.id;

    if (!isProjectAuthor)
      return res.status(400).json({ message: "Not Project Author" });

    const project = await Project.findByIdAndUpdate(projectId, req.body, {
      new: true,
    });
    if (!project)
      return res
        .status(400)
        .json({ message: `Project with ${projectId} not found` });

    return res.status(200).json(project);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Server Error", error: error.message || error });
  }
};

export const deleteProject = async (req: AuthRequest, res: Response) => {
  try {
    const projectId = req.params.id;
    const project = await Project.findById(projectId).select("author");
    if (!project)
      return res
        .status(404)
        .json({ message: `Project with ID ${projectId} not found` });

    const isProjectAuthor = project?.author.toString() === req.user.id;

    if (!isProjectAuthor)
      return res
        .status(403)
        .json({ message: "Forbidden: Not the project author" });

    await Project.findByIdAndDelete(projectId);
    return res.status(200).json({ message: "Project deleted successfully" });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Server Error", error: error.message || error });
  }
};

export const toggleLike = async (req: AuthRequest, res: Response) => {
  try {
    const projectId = req.params.id;
    const userId = req.user.id;
    if (!projectId)
      return res.status(400).json({ message: "Missing Project Id" });

    const project = await Project.findById(projectId);
    if (!project)
      return res
        .status(403)
        .json({ message: `Project ${projectId} not found` });

    if (project.likes.includes(userId)) {

      project.likes = project.likes.filter((id) => id.toString() !== userId);

      await project.save();

      return res
        .status(200)
        .json({ message: "Project unliked", likesCount: project.likes.length });
    } else {
      project.likes.push(userId);
      await project.save();
      return res
        .status(200)
        .json({ message: "Project liked", likesCount: project.likes.length });
    }
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
