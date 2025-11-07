import mongoose, { Schema, Document, Types, Query } from "mongoose";

export interface IProject extends Document {
  title: string;
  description: string;
  author: Types.ObjectId;
  tag: string[];
  likes: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

const projectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Project description is required"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters long"],
    },
    tag: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual relationship to comments
projectSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "project",
  justOne: false,
});

// Prevent duplicate likes
projectSchema.methods.toggleLike = async function (userId: Types.ObjectId) {
  const index = this.likes.findIndex((id: Types.ObjectId) => id.equals(userId));
  if (index === -1) {
    this.likes.push(userId);
  } else {
    this.likes.splice(index, 1);
  }
  await this.save();
  return this;
};

projectSchema.pre(/^find/, function (this: Query<IProject[], IProject>, next) {
  this.populate({ path: "author", select: "name email avatar" });
  this.populate("comments");
  next();
});

export const Project = mongoose.model<IProject>("Project", projectSchema);
