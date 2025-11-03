import mongoose, {Document, Model, Schema} from "mongoose";

export interface IComment extends Document{
    project: Schema.Types.ObjectId;
    author: Schema.Types.ObjectId;
    text: string;
    createdAt: Date;
}

const CommentSchema: Schema<IComment> = new Schema<IComment>({
  project: {
    type: Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    required: true,
    trim: true
  }
} , {timestamps: true}
);

const Comment: Model<IComment> = mongoose.model<IComment>("Comments", CommentSchema);
export default Comment
