import { Request, Response } from "express";
import * as projectService from "../services/projectServices";
import { Types } from "mongoose";

/**
 * Helper function for consistent error responses
 */
function handleError(res: Response, error: any, status = 500) {
  console.error("Error:", error.message || error);
  res.status(status).json({
    message: error.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && {
      error: error.message,
      stack: error.stack,
    }),
  });
}
/** Validate URL format (must start with https://)
 */
function isValidUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Create a new project
 */
export async function createProject(req: Request, res: Response) {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { title, description, techStack, repoUrl, liveUrl } = req.body;

    // ✅ Validation
    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return res.status(400).json({ message: "Valid title is required" });
    }

    if (
      !description ||
      typeof description !== "string" ||
      description.trim().length === 0
    ) {
      return res.status(400).json({ message: "Valid description is required" });
    }

    if (
      !techStack ||
      (!Array.isArray(techStack) && typeof techStack !== "string")
    ) {
      return res.status(400).json({ message: "Valid techStack is required" });
    }

    // Validate repoUrl (optional, but must be valid https if provided)
    if (repoUrl !== undefined && repoUrl !== null && repoUrl !== "") {
      if (typeof repoUrl !== "string" || !isValidUrl(repoUrl)) {
        return res.status(400).json({
          message:
            "Repository URL must be a valid HTTPS link (e.g., https://github.com/user/repo)",
        });
      }
    }

    //  Validate liveUrl (optional, but must be valid https if provided)
    if (liveUrl !== undefined && liveUrl !== null && liveUrl !== "") {
      if (typeof liveUrl !== "string" || !isValidUrl(liveUrl)) {
        return res.status(400).json({
          message:
            "Live URL must be a valid HTTPS link (e.g., https://example.com)",
        });
      }
    }

    const data: {
      title: string;
      description: string;
      techStack: any[];
      createdBy: typeof req.user._id;
      repoUrl?: string;
      liveUrl?: string;
    } = {
      title: title.trim(),
      description: description.trim(),
      techStack: Array.isArray(techStack) ? techStack : [techStack],
      createdBy: req.user._id,
    };

    // Add optional URLs if provided
    if (repoUrl && repoUrl.trim()) {
      data.repoUrl = repoUrl.trim();
    }
    if (liveUrl && liveUrl.trim()) {
      data.liveUrl = liveUrl.trim();
    }

    const project = await projectService.createProject(data as any);
    res.status(201).json({
      message: "Project created successfully",
      project,
    });
  } catch (error: any) {
    handleError(res, error, 400);
  }
}

/**
 * Get all projects (optionally by user)
 */
export async function getAllProjects(req: Request, res: Response) {
  try {
    const userId = req.query.userId as string | undefined;
    const projects = await projectService.getAllProjects(userId);
    res.status(200).json({ projects });
  } catch (error: any) {
    handleError(res, error);
  }
}

/**
 * Get a single project by ID
 */
export async function getProjectById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    const project = await projectService.getProjectById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({ project });
  } catch (error: any) {
    handleError(res, error);
  }
}

/**
 * Update a project
 */
// In updateProject, validate what fields can be updated:
export async function updateProject(req: Request, res: Response) {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    // ✅ Whitelist allowed fields
    const { title, description, techStack, repoUrl, liveUrl } = req.body;
    const updateData: any = {};

    if (title !== undefined) {
      if (typeof title !== "string" || title.trim().length === 0) {
        return res.status(400).json({ message: "Invalid title" });
      }
      updateData.title = title.trim();
    }

    if (description !== undefined) {
      if (typeof description !== "string" || description.trim().length === 0) {
        return res.status(400).json({ message: "Invalid description" });
      }
      updateData.description = description.trim();
    }

    if (techStack !== undefined) {
      updateData.techStack = Array.isArray(techStack) ? techStack : [techStack];
    }
    // ✅ Validate repoUrl if being updated
    if (repoUrl !== undefined) {
      if (repoUrl !== null && repoUrl !== "") {
        if (typeof repoUrl !== "string" || !isValidUrl(repoUrl)) {
          return res.status(400).json({
            message: "Repository URL must be a valid HTTPS link",
          });
        }
        updateData.repoUrl = repoUrl.trim();
      } else {
        // Allow clearing the URL by setting to empty string
        updateData.repoUrl = "";
      }
    }

    // ✅ Validate liveUrl if being updated
    if (liveUrl !== undefined) {
      if (liveUrl !== null && liveUrl !== "") {
        if (typeof liveUrl !== "string" || !isValidUrl(liveUrl)) {
          return res.status(400).json({
            message: "Live URL must be a valid HTTPS link",
          });
        }
        updateData.liveUrl = liveUrl.trim();
      } else {
        // Allow clearing the URL by setting to empty string
        updateData.liveUrl = "";
      }
    }

    const project = await projectService.updateProject(
      id,
      updateData,
      req.user._id
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({ message: "Project updated", project });
  } catch (error: any) {
    handleError(res, error, 400);
  }
}
/**
 * Delete a project
 */
export async function deleteProject(req: Request, res: Response) {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    const success = await projectService.deleteProject(id, req.user._id);
    if (!success) {
      return res
        .status(404)
        .json({ message: "Project not found or not authorized" });
    }

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error: any) {
    handleError(res, error);
  }
}
