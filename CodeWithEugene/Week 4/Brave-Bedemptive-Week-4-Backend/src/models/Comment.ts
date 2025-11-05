import mongoose, { Document, Schema } from "mongoose";

export interface IComment extends Document {
  body: string;
  author: mongoose.Types.ObjectId;
  project: mongoose.Types.ObjectId;
}

const CommentSchema: Schema = new Schema(
  {
    body: { type: String, required: true, trim: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    project: { type: Schema.Types.ObjectId, ref: "Project", required: true }
  },
  { timestamps: true }
);

export default mongoose.model<IComment>("Comment", CommentSchema);
