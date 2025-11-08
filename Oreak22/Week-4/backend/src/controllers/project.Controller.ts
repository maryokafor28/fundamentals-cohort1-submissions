import { Request, Response } from "express";
import { Project } from "../models/project.model";
import { ProjectComment } from "../models/comment.model";
import { User } from "../models/user.models";

export const newProject = (req: Request, res: Response) => {
  console.log("project");
  try {
    const newProject = new Project({ ...req.body, userId: req.user._id });
    newProject
      .save()
      .then((response) => {
        res.status(200).send({ message: "project created", status: true });
      })
      .catch((err) => {
        res.status(400).send({ message: "Someting went Wrong", status: false });
      });
  } catch (err) {
    res.status(400).send({ message: "something went wrong", status: false });
  }
};

export const getProject = async (req: Request, res: Response) => {
  let project;
  try {
    project = await Project.find({ userId: req.user._id });
    if (!project?.length)
      return res.status(400).send({ message: "no project found" });

    res.status(200).send({ message: "Found projects", project });
  } catch (err) {
    res.status(400).send({ message: "something went wrong" });
  }
};

export const viewProfie = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ userName: req.params.userName }).select([
      "-password",
      "-updatedAt",
      "-refreshToken",
      "-lockedUntil",
      "-failedLogins",
      "-createdAt",
      "-accessToken",
    ]);
    if (!user) return res.status(400).send({ message: "no user found" });

    const project = await Project.find({ userId: user?._id });

    res.status(200).send({ message: "Found", user, project });
  } catch (err) {
    res.status(400).send({ message: "something went wrong here" });
  }
};

export const getOneProject = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const [project, comments] = await Promise.all([
      Project.findOne({ _id: id }),
      ProjectComment.find({ projectId: id }),
    ]);
    if (!project) return res.status(400).send({ message: "no project found" });

    res.status(200).send({ message: "Found projects", project, comments });
  } catch (err) {
    res.status(400).send({ message: "something went wrong" });
  }
};

///////////////////////////////////////////////////////////////
export const search = async (req: Request, res: Response) => {
  console.log("ww");
  try {
    const { query } = req.body;

    if (!query || typeof query !== "string") {
      return res.status(400).send({ message: "Query parameter is required" });
    }

    const baseFilter: any = {
      $or: [
        { name: { $regex: query, $options: "i" } },
        { userName: { $regex: query, $options: "i" } },
      ],
    };

    const users = await User.find(baseFilter).select([
      "-password",
      "-updatedAt",
      "-refreshToken",
      "-lockedUntil",
      "-failedLogins",
      "-createdAt",
      "-accessToken",
    ]);

    res.status(200).json({
      success: true,
      users: users,
    });
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//////////////////////////////////////////////////

export const newComment = (req: Request, res: Response) => {
  console.log("comment");
  try {
    const newComment = new ProjectComment({ ...req.body });
    newComment
      .save()
      .then((response) => {
        res.status(200).send({
          message: "Comment created",
          status: true,
          Comment: response,
        });
      })
      .catch((err) => {
        res.status(400).send({ message: "Someting went Wrong", status: false });
      });
  } catch (err) {
    res.status(400).send({ message: "something went wrong", status: false });
  }
};

const getComments = (req: Request, res: Response) => {
  try {
    ProjectComment.find({ projectId: req.params.id }).then((response) => {
      res.status(200).send({
        comments: response,
      });
    });
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: "Someting went Wrong", status: false });
  }
};
