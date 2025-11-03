import mongoose, {Document, Schema, Model} from "mongoose";

export interface IProject extends Document {
  title: string;
  description: string;
  techStack?: string[];
  author: mongoose.Schema.Types.ObjectId;
  likes: mongoose.Schema.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema:Schema<IProject> = new Schema<IProject>({
    title: {type: String, required:true, trim:true},
    description: {type: String, required: true, trim: true},
    techStack: {type:[String], default:[]},
    author: {type: Schema.Types.ObjectId,  trim: true, ref:"User"},
    likes: [{type: Schema.Types.ObjectId, ref:"User"}]
}, {timestamps:true})

const Project: Model<IProject> = mongoose.model<IProject>("project", ProjectSchema)

export default Project
