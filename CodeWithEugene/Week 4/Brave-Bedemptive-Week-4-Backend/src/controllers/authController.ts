import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import config from "../config";

export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: "Username or email already exists" });
    }

    const user = new User({ username, email, password });
    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;

    const token = jwt.sign({ id: user._id }, config.jwtSecret, { expiresIn: "1d" });

    res.status(201).json({
      accessToken: token,
      user: userResponse
    });
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user || !user.password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const userResponse = user.toObject();
    delete userResponse.password;

    const token = jwt.sign({ id: user._id }, config.jwtSecret, { expiresIn: "1d" });

    res.status(200).json({
      accessToken: token,
      user: userResponse
    });
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
