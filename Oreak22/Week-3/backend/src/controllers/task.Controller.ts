import { Request, Response } from "express";
import { Task } from "../models/task.model";

export const newTask = (req: Request, res: Response) => {
  try {
    const newTask = new Task({ ...req.body, userId: req.user._id });
    newTask
      .save()
      .then((response) => {
        res.status(200).send({ message: "task created", status: true });
      })
      .catch((err) => {
        res.status(400).send({ message: "Someting went Wrong", status: false });
      });
  } catch (err) {
    res.status(400).send({ message: "something went wrong", status: false });
  }
};

export const getTask = async (req: Request, res: Response) => {
  let task;
  try {
    if (req.user.role == "user") {
      task = await Task.find({ userId: req.user._id });
      if (!task.length)
        return res.status(404).send({ message: "No tasks found" });
    }
    if (req.user.role == "admin") {
      task = await Task.find();
      if (!task?.length)
        return res.status(400).send({ message: "no task found" });
    }
    res.status(200).send({ message: "Found tasks", task });
  } catch (err) {
    res.status(400).send({ message: "something went wrong" });
  }
};

export const deletTask = (req: Request, res: Response) => {
  try {
    Task.findByIdAndDelete(req.params.id)
      .then((response) => {
        res.status(200).send({ message: "Task deleted" });
      })
      .catch((err) => {
        res.status(400).send({ message: "something when wrong" });
      });
  } catch {
    res.status(400).send({ message: "something when wrong" });
  }
};
///////////////////////////////////////////////////////////////
export const search = async (req: Request, res: Response) => {
  const { role, _id } = req.user;
  try {
    const { query, page = "1", limit = "10", sort = "desc" } = req.query;

    if (!query || typeof query !== "string") {
      return res.status(400).send({ message: "Query parameter is required" });
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const sortOrder = sort === "asc" ? 1 : -1;

    const baseFilter: any = {
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    };

    if (role === "user") {
      baseFilter.userId = _id;
    }

    const [tasks, total] = await Promise.all([
      Task.find(baseFilter)
        .sort({ createdAt: sortOrder })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),

      Task.countDocuments(baseFilter),
    ]);

    res.status(200).send({
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      tasks,
    });
  } catch (error: any) {
    res.status(500).send({ message: "Server error", error: error.message });
  }
};
//////////////////////////////////////////////////

export const filter = async (req: Request, res: Response) => {
  try {
  const { role, _id } = req.user;
  const { userId, time, page = "1", limit = "10", sort = "desc" } = req.query;

    const filter: any = {};

    if (role === "user") {
      filter.userId = _id;
    } else if (userId) {
      filter.userId = userId;
    }

    if (time) filter.time = time;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const sortOrder = sort === "asc" ? 1 : -1;

    const [tasks, total] = await Promise.all([
      Task.find(filter)
        .sort({ createdAt: sortOrder })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),

      Task.countDocuments(filter),
    ]);

    res.status(200).send({
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      tasks,
    });
  } catch (error: any) {
    res.status(500).send({ message: "Server error", error: error.message });
  }
};
