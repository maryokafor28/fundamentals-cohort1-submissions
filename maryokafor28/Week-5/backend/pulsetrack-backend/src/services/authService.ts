import { User } from "../models/User";
import { Doctor } from "../models/Doctor"; // ✅ Import Doctor model
import { generateToken } from "../utils/generateToken";

// Register user
export const registerUser = async (
  name: string,
  email: string,
  password: string,
  role?: "user" | "doctor"
) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || "user",
  });

  // ✅ Auto-create Doctor profile if role is "doctor"
  if (role === "doctor") {
    await Doctor.create({
      user: user._id,
      name: user.name,
      email: user.email,
      specialization: "General Practice", // Default specialization
      appointments: [],
    });
  }

  const token = generateToken(user._id.toString());

  return {
    token,
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

// Login user
export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new Error("Invalid email or password");

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new Error("Invalid email or password");

  const token = generateToken(user._id.toString());

  return {
    token,
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

// Get user by ID
export const getUserById = async (id: string) => {
  const user = await User.findById(id).select("-password");
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

// Delete all users (DANGEROUS - Backend only!)
export const deleteAllUsers = async () => {
  const result = await User.deleteMany({});
  return {
    deletedCount: result.deletedCount,
    message: `Successfully deleted ${result.deletedCount} users`,
  };
};
