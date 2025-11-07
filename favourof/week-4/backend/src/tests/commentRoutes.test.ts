import request from "supertest";
import express, { Application } from "express";
import mongoose from "mongoose";
import {
  createComment,
  getCommentsForProject,
  updateComment,
} from "../controllers/commentController";
import { Comment } from "../models/comment";
import { Project } from "../models/project";
import AppError from "../utils/AppError";

// mock dependencies
jest.mock("../models/comment");
jest.mock("../models/project");
jest.mock("../utils/loggers", () => ({
  securityLoggerInstance: { warn: jest.fn() },
}));

// mock express app
const app: Application = express();
app.use(express.json());

// mock auth middleware
app.use((req, res, next) => {
  (req as any).user = { id: new mongoose.Types.ObjectId() };
  next();
});

// sample routes
app.post("/projects/:projectId/comments", createComment);
app.get("/projects/:projectId/comments", getCommentsForProject);
app.patch("/comments/:id", updateComment);

// ✅ Add a simple error handler to simulate production error response
app.use((err: any, req: any, res: any, next: any) => {
  const status = err.statusCode || 500;
  res.status(status).json({
    status: "error",
    message: err.message,
  });
});

describe("Comment Controller Endpoints", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // 1️⃣ Create comment test
  it("should create a comment successfully", async () => {
    const mockProject = { _id: new mongoose.Types.ObjectId() };
    (Project.findById as jest.Mock).mockResolvedValue(mockProject);
    (Comment.create as jest.Mock).mockResolvedValue({
      _id: new mongoose.Types.ObjectId(),
      text: "Nice project!",
      author: "user123",
      project: mockProject._id,
    });

    const res = await request(app)
      .post(`/projects/${mockProject._id}/comments`)
      .send({ text: "Nice project!" });

    expect(res.status).toBe(201);
    expect(res.body.status).toBe("success");
    expect(res.body.data.text).toBe("Nice project!");
  });

  // 2️⃣ Missing text validation test
  it("should return 400 if comment text is missing", async () => {
    const res = await request(app)
      .post(`/projects/${new mongoose.Types.ObjectId()}/comments`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Comment text is required");
  });

  // 3️⃣ Update comment unauthorized test
  it("should return 403 if user tries to edit another user's comment", async () => {
    const mockComment = {
      _id: new mongoose.Types.ObjectId(),
      author: { _id: new mongoose.Types.ObjectId() }, // different user
      text: "Original text",
      save: jest.fn(),
    };
    (Comment.findById as jest.Mock).mockResolvedValue(mockComment);

    const res = await request(app)
      .patch(`/comments/${mockComment._id}`)
      .send({ text: "Hacked text" });

    expect(res.status).toBe(403);
    expect(res.body.message).toBe(
      "You are not authorized to edit this comment"
    );
  });
});
