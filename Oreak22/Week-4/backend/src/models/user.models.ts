import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  userName: { type: String, required: true, unique: true },
  failedLogins: { type: Number },
  lockedUntil: { type: Date },
  accessToken: { type: String },
  refreshToken: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});
const User = mongoose.model("User", userSchema);

export { User };

//
//
//
//
//
//

export interface User {
  id: string;
  email: string;
  password: string;
  userName?:string
}

let users: User[] = [];

export const verifyPassword = async (
  password: string,
  hash: string
): Promise<boolean> => bcrypt.compare(password, hash);
