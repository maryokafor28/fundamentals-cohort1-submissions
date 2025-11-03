import mongoose, {Model, Document, Schema} from "mongoose";

export interface IUser extends Document{
    name: string;
    email: string;
    password: string;
    bio?: string;
    location?:string;
    githubUrl?:string;
    xUrl?: string;
    avatarUrl?: string;
    techStack?: string[];
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, unique: true },
  password: { type: String, required: true},
  bio: {type:String, trim:true},
  location: {type:String, trim:true},
  githubUrl: {type:String, trim:true},
  xUrl: {type:String, trim:true},
  avatarUrl: {type:String, trim:true},
  techStack: {
    type: [String],
    default: [],
    validate: {
      validator: (arr: string[] )=> arr.length <= 10,
      message: "The max tech stack count should be less than 10"
    }
  }
}, {timestamps: true});

const User: Model<IUser> = mongoose.model("User", UserSchema)
export default User
