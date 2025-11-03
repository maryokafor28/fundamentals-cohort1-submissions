import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  role: string;
  failedLoginAttempts: number;
  lockUntil: Date | null;
  refreshTokens: string[]
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user", enum: ["user","admin"] },
  failedLoginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date, default: null },
  refreshTokens: {type: [String], default: [] }
});

export const User = mongoose.model<IUser>("User", UserSchema);
