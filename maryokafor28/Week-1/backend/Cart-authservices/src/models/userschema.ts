import mongoose, { Document, Schema } from "mongoose";

export interface UserDocument extends Document {
  email: string;
  name: string;
  password: string; // hashed
  _id: string;
}

const userSchema = new Schema<UserDocument>({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true }, // hashed password
});

const User = mongoose.model<UserDocument>("User", userSchema);

export default User;
