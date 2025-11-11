import { Request, Response } from "express";
import { Task } from "../models/Task";
import { sanitizeInput, sanitizeObjectInput } from "../utils/validators";

export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    // Build query based on role
    const query: any = {};

    // If user is NOT admin, only show their tasks
    if (req.user?.role === "user") {
      query.createdBy = req.user.id;
    }
    // If admin, show all tasks (query stays empty)

    const tasks = await Task.find(query);
    res.status(200).json(tasks);
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const createTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    //  Clean up all user input
    const cleanBody = sanitizeObjectInput(req.body);
    const { title, description } = cleanBody;

    // ✅ Validate required fields
    if (!title || typeof title !== "string" || title.trim().length < 3) {
      res.status(400).json({ message: "Title must be at least 3 characters" });
      return;
    }

    if (description && typeof description !== "string") {
      res.status(400).json({ message: "Invalid description" });
      return;
    }

    // ✅ Create the task
    const task = new Task({
      title: sanitizeInput(title),
      description: sanitizeInput(description || ""),
      createdBy: req.user?.id,
    });

    await task.save();

    // ✅ FIXED: Return just the task object, not wrapped in another object
    res.status(201).json(task);
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//delete task//
export const deleteTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    // ✅ Check if task exists first
    const task = await Task.findById(id);

    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    // ✅ Only admins can delete tasks OR user can delete their own tasks
    if (
      req.user?.role !== "admin" &&
      task.createdBy?.toString() !== req.user?.id
    ) {
      res
        .status(403)
        .json({ message: "You don't have permission to delete this task" });
      return;
    }

    await Task.findByIdAndDelete(id);
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Search Task//
export const searchTasks = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { keyword = "", page = 1, limit = 10 } = req.body;

    // Sanitize input
    const cleanKeyword = sanitizeInput(keyword);
    const skip = (Number(page) - 1) * Number(limit);

    // Build base query
    const query: any = {
      $or: [
        { title: { $regex: cleanKeyword, $options: "i" } },
        { description: { $regex: cleanKeyword, $options: "i" } },
      ],
    };

    // Restrict users to their own tasks
    if (req.user?.role === "user") {
      query.createdBy = req.user.id;
    }

    const tasks = await Task.find(query)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Task.countDocuments(query);

    res.status(200).json({
      message: "Search successful",
      currentPage: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      totalResults: total,
      tasks,
    });
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const filterTasks = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { startDate, endDate, status, page = 1, limit = 10 } = req.body;
    const skip = (Number(page) - 1) * Number(limit);

    const query: any = {};

    // Restrict users to their own tasks
    if (req.user?.role === "user") {
      query.createdBy = req.user.id;
    }

    // Optional filters
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    if (status) {
      query.status = sanitizeInput(status);
    }

    const tasks = await Task.find(query)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Task.countDocuments(query);

    res.status(200).json({
      message: "Filter successful",
      currentPage: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      totalResults: total,
      tasks,
    });
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
