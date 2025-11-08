import mongoose from "mongoose";

const projectCommentSchema = new mongoose.Schema({
  author: { type: String, required: true },
  content: { type: String, required: true },
  projectId: { type: String, required: true },
  createdAt: { type: Date, default: new Date().toISOString() },
});

const ProjectComment = mongoose.model("comments", projectCommentSchema);

export { ProjectComment };
