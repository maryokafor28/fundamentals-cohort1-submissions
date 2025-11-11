// src/modules/auth/service.ts
import User, { IUser } from "../users/model";
import { generateToken } from "../../utils/token";

export async function registerUser(payload: {
  name: string;
  email: string;
  password: string;
}): Promise<{
  _id: string;
  name: string;
  email: string;
}> {
  const { name, email, password } = payload;

  // Check if user exists
  const existing = await User.findOne({ email });
  if (existing) throw new Error("User already exists");

  // Create — password will be hashed in pre-save hook
  const user = new User({ name, email, password });
  await user.save();

  // Return safe user info only
  return {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
  };
}

export async function loginUser(payload: {
  email: string;
  password: string;
}): Promise<{
  token: string;
  user: { _id: string; email: string; name: string };
}> {
  const { email, password } = payload;

  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials");

  //compare
  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new Error("Invalid credentials");

  // Generate token
  const token = generateToken(user._id.toString(), user.email);

  return {
    token,
    user: {
      _id: user._id.toString(),
      email: user.email,
      name: user.name,
    },
  };
}
