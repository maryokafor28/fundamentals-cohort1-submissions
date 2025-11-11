// src/services/authService.ts
import bcrypt from "bcryptjs";
import User, { IUser } from "../models/users";
import generateToken from "../utils/generateToken";

// services/authServices.ts
export async function registerUser(
  name: string,
  email: string,
  password: string
) {
  // Remove manual check - let MongoDB throw error code 11000
  const hashedPassword = await bcrypt.hash(password, 10);

  // This will throw error.code = 11000 if email exists
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const token = generateToken(user._id.toString());

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    token,
  };
}
export async function loginUser(email: string, password: string) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = generateToken(user._id.toString());

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    token,
  };
}

export function logoutUser() {
  return { message: "Logged out successfully" };
}

export async function getCurrentUser(userId: string) {
  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new Error("User not found");
  }

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
  };
}
