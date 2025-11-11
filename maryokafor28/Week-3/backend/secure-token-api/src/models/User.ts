import mongoose, { Document, Schema, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;

  email: string;
  passwordHash: string;
  role: "user" | "admin";
  failedLoginAttempts: number;
  lockUntil: Date | null;
  refreshTokens: string[]; // Store active refresh tokens or IDs
  createdAt: Date;
  updatedAt: Date;
  isLocked: () => boolean;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      minlength: 5,
      maxlength: 100,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // simple email validation
    },
    passwordHash: {
      type: String,
      required: true,
      minlength: 8,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
      default: null,
    },
    refreshTokens: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);
// 🔐 Check if account is locked
userSchema.methods.isLocked = function (): boolean {
  return this.lockUntil !== null && this.lockUntil > new Date();
};

export const User = mongoose.model<IUser>("User", userSchema);
