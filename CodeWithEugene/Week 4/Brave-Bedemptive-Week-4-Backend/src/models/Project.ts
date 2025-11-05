import mongoose, { Document, Schema } from "mongoose";

export interface IProject extends Document {
  title: string;
  summary: string;
  description: string;
  techStack: string[];
  repoUrl?: string;
  liveUrl?: string;
  author: mongoose.Types.ObjectId;
  status: "open" | "in-progress" | "completed";
  likes: number;
  tags: string[];
}

const ProjectSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    summary: { type: String, required: true, trim: true, maxlength: 140 },
    description: { type: String, required: true },
    techStack: [{ type: String, trim: true }],
    repoUrl: { type: String, trim: true },
    liveUrl: { type: String, trim: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["open", "in-progress", "completed"],
      default: "open"
    },
    likes: { type: Number, default: 0 },
    tags: [{ type: String, trim: true }]
  },
  { timestamps: true }
);

export default mongoose.model<IProject>("Project", ProjectSchema);
