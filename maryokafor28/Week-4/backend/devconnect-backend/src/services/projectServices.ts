import Project, { IProject } from "../models/project";
import { Types } from "mongoose";
import Comment from "../models/comment";

// Create a new project
export function createProject(
  data: Omit<IProject, "_id" | "createdAt" | "updatedAt"> & {
    createdBy: Types.ObjectId;
  }
): Promise<IProject> {
  return Project.create(data);
}

// Get all projects (optionally filtered by user) with comment count
export async function getAllProjects(userId?: string): Promise<any[]> {
  const filter = userId ? { createdBy: userId } : {};
  const projects = await Project.find(filter)
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 });

  // ✅ Add comment count to each project
  const projectsWithComments = await Promise.all(
    projects.map(async (project) => {
      const commentCount = await Comment.countDocuments({
        projectId: project._id,
      });
      return {
        ...project.toObject(),
        commentCount,
      };
    })
  );

  return projectsWithComments;
}

// Get a single project by ID
export function getProjectById(projectId: string): Promise<IProject | null> {
  if (!Types.ObjectId.isValid(projectId)) return Promise.resolve(null);
  return Project.findById(projectId)
    .populate("createdBy", "name email")
    .populate({
      path: "comments",
      model: Comment,
    });
}

// Update project
export function updateProject(
  projectId: string,
  data: Partial<IProject>,
  userId: string
): Promise<IProject | null> {
  // Validate BEFORE querying database
  if (!Types.ObjectId.isValid(projectId)) return Promise.resolve(null);

  // Now safe to use projectId
  return Project.findOneAndUpdate(
    { _id: projectId, createdBy: userId }, // only project owner can update
    data,
    { new: true, runValidators: true }
  );
}

// Delete project
export async function deleteProject(
  projectId: string,
  userId: string
): Promise<boolean> {
  if (!Types.ObjectId.isValid(projectId)) return false;

  const result = await Project.deleteOne({
    _id: projectId,
    createdBy: userId, // only project owner can delete
  });

  return result.deletedCount === 1;
}
