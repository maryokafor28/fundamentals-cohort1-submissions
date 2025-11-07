import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { RegistrationInput,sanitizeInput, validateRegistration } from "../utils/validateInput.js";

const register = async (req: Request, res: Response) => {
  try {
   

    const name = sanitizeInput(req.body.name)
    const email = sanitizeInput(req.body.email)
    const password = sanitizeInput(req.body.password);


    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing Credentials" });
    }

    const error = validateRegistration({email,password} as RegistrationInput)
    if (error.length > 0) return res.status(400).json({message: "Invalid Username or password"})

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already existing" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: passwordHash });

    const token = jwt.sign(
      { userId: String(user._id) },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    return res
      .status(201)
      .json({ token, user: { name, id: String(user._id), email } });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as {
      email: string;
      password: string;
    };

    if (!email || !password) {
      return res.status(400).json({ message: "Missing login details" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const verifiedPassword = await bcrypt.compare(password, user.password);
    if (!verifiedPassword)
      return res
        .status(400)
        .json({ message: "Incorrect username or password" });

    const token = jwt.sign(
      { userId: String(user._id) },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      token,
      user: {
        userId: String(user._id),
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Error Login In: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export  { register, login };
