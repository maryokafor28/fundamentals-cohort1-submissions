import mongoose, { Schema } from "mongoose";

interface User {
  email: string;
  createdAt: string;
  password: string;
}

const userSchema = new Schema<User>({
  email: { type: String, required: true },
  createdAt: { type: String, required: false },
  password: { type: String, required: true },
});

export default mongoose.model<User>("User", userSchema);
