
import { Request, Response } from "express";
import {Task} from "../models";
import { AuthRequest } from "../middleware/authMiddleware";
import {
  validateTaskInput,
  validatePagination,
  isValidObjectId,
  sanitizeText,
  whitelistSortField,
} from "../utils/sanitizer";


export async function listTasks(req: AuthRequest, res: Response) {
  const { page, perPage } = validatePagination(req.query);
  const skip = (page - 1) * perPage;

  const user = req.user!;
  const baseQuery: any = user.role === "admin" ? {} : { ownerId: user.id };

  const [items, total] = await Promise.all([
    Task.find(baseQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(perPage)
      .lean(),
    Task.countDocuments(baseQuery),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / perPage));
  return res.json({ data: items, page, perPage, totalPages, totalItems: total });
}


export async function createTask(req: AuthRequest, res: Response) {
  const user = req.user!;
  const validation = validateTaskInput(req.body);
  if (!validation.ok) return res.status(400).json({ errors: validation.errors });

  const { title, description, metadata } = validation.data!;
  const newTask = new Task({
    ownerId: user.id,
    title,
    description,
    metadata: metadata || {},
  });

  await newTask.save();
  return res.status(201).json({ message: "Task created", task: newTask });
}


export async function deleteTask(req: AuthRequest, res: Response) {
  const { id } = req.params;
  if (!isValidObjectId(id)) return res.status(400).json({ message: "Invalid task id" });

  const task = await Task.findById(id);
  if (!task) return res.status(404).json({ message: "Task not found" });

  await task.deleteOne();
  return res.json({ message: "Task deleted" });
}


export async function searchTasks(req: AuthRequest, res: Response) {
  const { q } = req.body;
  const { page, perPage } = validatePagination(req.body);
  const skip = (page - 1) * perPage;

  const user = req.user!;
  const text = sanitizeText(q);
  if (!text) return res.status(400).json({ message: "Search query required" });

  const regex = new RegExp(text, "i");
  const baseQuery: any = user.role === "admin" ? { $or: [{ title: regex }, { description: regex }] } : { ownerId: user.id, $or: [{ title: regex }, { description: regex }] };

  const [items, total] = await Promise.all([
    Task.find(baseQuery).sort({ createdAt: -1 }).skip(skip).limit(perPage).lean(),
    Task.countDocuments(baseQuery),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / perPage));
  return res.json({ data: items, page, perPage, totalPages, totalItems: total });
}


export async function filterTasks(req: AuthRequest, res: Response) {
  const { filters = {}, sortBy } = req.body;
  const { page, perPage } = validatePagination(req.body);
  const skip = (page - 1) * perPage;

  const user = req.user!;
  const query: any = {};

  if (filters.createdAfter) {
    const d = new Date(filters.createdAfter);
    if (!isNaN(d.getTime())) query.createdAt = { ...(query.createdAt || {}), $gte: d };
  }
  if (filters.createdBefore) {
    const d = new Date(filters.createdBefore);
    if (!isNaN(d.getTime())) query.createdAt = { ...(query.createdAt || {}), $lte: d };
  }

  if (filters.ownerId) {
    if (user.role !== "admin") return res.status(403).json({ message: "Forbidden to filter by owner" });
    if (!isValidObjectId(filters.ownerId)) return res.status(400).json({ message: "Invalid ownerId" });
    query.ownerId = filters.ownerId;
  } else {
    if (user.role !== "admin") query.ownerId = user.id;
  }

  const sortField = whitelistSortField(sortBy);
  const [items, total] = await Promise.all([
    Task.find(query).sort({ [sortField]: -1 }).skip(skip).limit(perPage).lean(),
    Task.countDocuments(query),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / perPage));
  return res.json({ data: items, page, perPage, totalPages, totalItems: total });
}
