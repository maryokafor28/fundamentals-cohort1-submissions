import { Request, Response, NextFunction } from "express";
import { Task } from "../models/task";
import { User } from "../models/user";
import { securityLoggerInstance } from "../utils/logger";

export const getTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.id;

    const userRole = req.user.role;

    let tasks;

    if (userRole === "admin") {
      tasks = await Task.find().populate("userId", "name role");
      securityLoggerInstance.info("TASK_LIST_VIEWED_ADMIN", {
        userId,
        count: tasks.length,
      });
    } else {
      tasks = await Task.find({ userId }).populate("userId", "name role");
      securityLoggerInstance.info("TASK_LIST_VIEWED_USER", {
        userId,
        count: tasks.length,
      });
    }

    res.status(200).json(tasks);
  } catch (err) {
    next(err);
  }
};

export const createTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const task = await Task.create({
      title: req.body.title,
      description: req.body.description,
      userId: req.user.id,
    });
    securityLoggerInstance.info("TASK_CREATED", {
      userId: req.user.id,
      taskId: task._id,
    });
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

export const deleteTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(req.params.id, req.user.id);

    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!task) return res.status(404).json({ message: "Task not found" });
    securityLoggerInstance.info("TASK_DELETED", {
      userId: req.user.id,
      taskId: req.params.id,
    });
    res.status(200).json({ message: "Task deleted" });
  } catch (err) {
    console.log(err);

    next(err);
  }
};
