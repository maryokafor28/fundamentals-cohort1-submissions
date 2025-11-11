// src/services/authservices.ts
import bcrypt from "bcrypt";
import User from "../models/userschema";
import type { UserDocument } from "../models/userschema";

interface RegisterInput {
  email: string;
  password: string;
  name: string;
}

interface LoginInput {
  identifier: string;
  password: string;
}

// Register
export const registerUser = async ({
  email,
  password,
  name,
}: RegisterInput): Promise<UserDocument> => {
  console.log("📝 Registering user:", { email, name, password }); // Temporary debug

  const existing = await User.findOne({ email });
  if (existing) throw new Error("User already exists");

  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("🔐 Generated hash:", hashedPassword.substring(0, 20) + "...");

  const user = new User({ email, name, password: hashedPassword });
  const savedUser = await user.save();

  console.log("💾 User saved:", savedUser.email);
  return savedUser;
};
// Login (returns user)
export const loginUser = async ({
  identifier,
  password,
}: LoginInput): Promise<UserDocument> => {
  const user = await User.findOne({
    $or: [{ email: identifier }, { name: identifier }],
  });

  if (!user) throw new Error("Invalid credentials");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  return user; // ✅ full mongoose doc with _id
};
