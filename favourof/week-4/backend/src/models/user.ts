import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  name: string;
  avatar: string;
  email: string;
  role: "user";
  bio: string;
  skills: string[];
  LinkedIn: string;
  github: string;
  createdAt: Date;
  password: string;
  refreshToken: string | null;
  failedLoginAttempts: number;
  lockUntil: Date | null;
  comparePassword(candidate: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    minlength: [2, "Name must be at least 2 characters long"],
  },
  bio: {
    type: String,
    trim: true,
    minLength: [10, "Bio must be at least 2 charaters long"],
  },
  avatar: {
    type: String,
    required: true,
    default: function () {
      return this.name ? this.name.charAt(0).toUpperCase() : "U";
    },
  },
  LinkedIn: {
    type: String,
    trim: true,
    match: [
      /^https:\/\/(www\.)?linkedin\.com\/.*$/,
      "Please enter a valid LinkedIn URL",
    ],
  },
  skills: {
    type: [String],
    default: [],
    lowercase: true,
  },
  github: {
    type: String,
    trim: true,
    match: [
      /^https:\/\/(www\.)?github\.com\/[A-Za-z0-9_-]+$/,
      "Please enter a valid GitHub URL",
    ],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters long"],
    select: false,
  },
  role: {
    type: String,
    enum: ["user"],
    default: "user",
  },
  refreshToken: {
    type: String,
    default: null,
    select: false,
  },
  failedLoginAttempts: {
    type: Number,
    default: 0,
  },
  lockUntil: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// 🔒 Hash password before saving
userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error); // Pass error to Mongoose
  }
});

// 🧮 Method to compare passwords
userSchema.methods.comparePassword = async function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

export const User = mongoose.model<IUser>("User", userSchema);
