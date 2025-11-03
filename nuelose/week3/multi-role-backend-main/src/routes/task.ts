import express from "express";
import type { Request, Response } from "express";
import mongoose from "mongoose";
import { requireAuth, requireRole } from "../middlewares/auth";
import { Task } from "../models/Task";
import { getPaginationParams } from "../utils/pagination";
import { sanitizeInput } from "../utils/validateInput";

const router = express.Router();

router.get("/", requireAuth, async (req: Request, res: Response) => {
  try {
    const query =
      req.user.role === "admin"
        ? {}
        : { userId: new mongoose.Types.ObjectId(req.user._id) };

    const tasks = await Task.find(query).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (e) {
    const err = e as Error;
    res.status(500).json({ message: err.message });
  }
});

router.post("/", requireAuth, async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;

    if (!title || typeof title !== "string") {
      return res
        .status(400)
        .json({ message: "Title is required and must be a string" });
    }

    const cleanTitle = sanitizeInput(title.trim());
    const cleanDescription = sanitizeInput(description?.trim() || "");

    const task = new Task({
      title: cleanTitle,
      description: cleanDescription,
      userId: new mongoose.Types.ObjectId(req.user._id),
    });

    await task.save();
    return res.status(201).json({ message: "Task created successfully", task });
  } catch (e) {
    const error = e as Error;
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    await task.deleteOne();
    res.json({ message: "Task deleted successfully" });
  } catch (e) {
    const err = e as Error;
    res.status(500).json({ message: err.message });
  }
});


router.post("/search", requireAuth, async (req: Request, res: Response) => {
  try {
    const { keyword } = req.body;
    const { page, limit, skip } = getPaginationParams(req);
    const sanitizedKeyword = sanitizeInput(keyword || "");


    const query: any = {
      $or: [
        { title: { $regex: sanitizedKeyword, $options: "i" } },
        { description: { $regex: sanitizedKeyword, $options: "i" } },
      ],
    };

    if (req.user.role !== "admin") {
      query.userId = new mongoose.Types.ObjectId(req.user._id);
    }


    const total = await Task.countDocuments(query);
    const results = await Task.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({ page, limit, total, results });
  } catch (e) {
    const err = e as Error;
    res.status(500).json({ message: err.message });
  }
});


router.post("/filter", requireAuth, async (req: Request, res: Response) => {
  try {
    const { fromDate, toDate, title } = req.body;
    const { page, limit, skip } = getPaginationParams(req);

    const query: any = {};

    if (req.user.role !== "admin") {
      query.userId = new mongoose.Types.ObjectId(req.user._id);
    }

    if (fromDate || toDate) {
      query.createdAt = {};
      if (fromDate) query.createdAt.$gte = new Date(fromDate);
      if (toDate) query.createdAt.$lte = new Date(toDate);
    }

    if (title) {
      query.title = { $regex: sanitizeInput(title), $options: "i" };
    }

    const total = await Task.countDocuments(query);
    const results = await Task.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({ page, limit, total, results });
  } catch (e) {
    const err = e as Error;
    res.status(500).json({ message: err.message });
  }
});

export default router;
