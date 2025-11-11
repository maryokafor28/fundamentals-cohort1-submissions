import mongoose, { Document, Schema, Types } from "mongoose";

export interface IProject extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  liveUrl: string;
  repoUrl: string;
  techStack: string[];
  createdBy: Types.ObjectId;
  comments: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    liveUrl: { type: String, trim: true, default: "" },
    repoUrl: { type: String, trim: true, default: "" },
    techStack: {
      type: [String],
      default: [],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model<IProject>("Project", projectSchema);
export default Project;
