import mongoose, { Document, Query, Schema } from "mongoose";

export interface IComment extends Document {
  text: string;
  project: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  createdAt?: Date;
}

const commentSchema = new Schema<IComment>(
  {
    text: {
      type: String,
      required: [true, "Comment text is required"],
      trim: true,
      minlength: [1, "Comment cannot be empty"],
    },
    project: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Project",
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-populate author details
commentSchema.pre(/^find/, function (this: Query<IComment, IComment>, next) {
  this.populate("author", "name email avatar");
  next();
});

export const Comment = mongoose.model<IComment>("Comment", commentSchema);
