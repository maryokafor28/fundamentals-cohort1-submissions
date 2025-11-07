import { Request, Response, NextFunction } from "express";
import { Project } from "../models/project";
import AppError from "../utils/AppError";
import { securityLoggerInstance } from "../utils/loggers";

//  Create Project
export const createProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.id;
    const { title, description, tag } = req.body;

    if (!title || !description) {
      return next(new AppError("Title and description are required", 400));
    }

    const newProject = await Project.create({
      title: title.trim(),
      description: description.trim(),
      author: userId,
      tag: Array.isArray(tag) ? tag.map((t) => t.toLowerCase()) : [],
    });

    res.status(201).json({
      status: "success",
      message: "Project created successfully",
      data: newProject,
    });
  } catch (err) {
    next(err);
  }
};

//  Get All Projects
export const getAllProjects = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [projects, total] = await Promise.all([
      Project.find()
        .populate("author", "name email avatar")
        .populate("comments")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Project.countDocuments(),
    ]);

    res.status(200).json({
      status: "success",
      count: projects.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: projects,
    });
  } catch (err) {
    next(err);
  }
};

//  Get Single Project
export const getProjectById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const project = await Project.findById(req.params.id).populate(
      "author",
      "name avatar skills github LinkedIn"
    );

    if (!project) return next(new AppError("Project not found", 404));

    res.status(200).json({ status: "success", data: project });
  } catch (err) {
    next(err);
  }
};

//  Update Project (only author)
export const updateProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const project = await Project.findById(id);
    if (!project) return next(new AppError("Project not found", 404));

    if (project.author._id.toString() !== userId.toString()) {
      securityLoggerInstance.warn("UNAUTHORIZED_EDIT_PROJECT", {
        userId,
        ip: req.ip,
        project: project.id,
      });
      return next(
        new AppError("You are not authorized to edit this project", 403)
      );
    }

    const { title, description, tag } = req.body;

    if (title) project.title = title.trim();
    if (description) project.description = description.trim();
    if (tag && Array.isArray(tag))
      project.tag = tag.map((t) => t.toLowerCase());

    await project.save();

    res.status(200).json({
      status: "success",
      message: "Project updated successfully",
      data: project,
    });
  } catch (err) {
    next(err);
  }
};

//  Delete Project
export const deleteProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    console.log(userId, "this is the user id");

    const project = await Project.findById(id);
    if (!project) return next(new AppError("Project not found", 404));

    if (project.author._id.toString() !== userId.toString()) {
      securityLoggerInstance.warn("UNAUTHORIZED_DELETE_PROJECT", {
        userId,
        ip: req.ip,
        project: project.id,
      });
      return next(
        new AppError("You are not authorized to delete this project", 403)
      );
    }

    await project.deleteOne();

    res
      .status(200)
      .json({ status: "success", message: "Project deleted successfully" });
  } catch (err) {
    next(err);
  }
};

// Like / Unlike Project
export const toggleLikeProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const project = await Project.findById(id);
    if (!project) return next(new AppError("Project not found", 404));

    const alreadyLiked = project.likes.includes(userId);

    if (alreadyLiked) {
      project.likes = project.likes.filter(
        (u: any) => u.toString() !== userId.toString()
      );
    } else {
      project.likes.push(userId);
    }

    await project.save();

    res.status(200).json({
      status: "success",
      message: alreadyLiked ? "Project unliked" : "Project liked",
      data: project,
    });
  } catch (err) {
    next(err);
  }
};
