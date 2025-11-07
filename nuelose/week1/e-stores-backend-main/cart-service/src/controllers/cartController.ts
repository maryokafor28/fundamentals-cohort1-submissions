import { Response, Request } from "express";

import Cart from "../models/cart";
import User from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const addToCart = async (req: Request, res: Response) => {
  const { userId } = (req as any).user;
  const { productId, quantity } = req.body;

  if (!userId || !productId || quantity < 1)
    return res.status(400).json({ message: "Invalid productId or quatity" });
  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId === productId
    );
    if (itemIndex > -1) {
      cart.items[itemIndex]!.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error adding to cart", error });
  }
};

export const getCart = async (req: Request, res: Response) => {
  const { user } = req;
  console.log({ user });
  try {
    const cart = await Cart.findOne({ userId: user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.status(200).json(cart);
    res.status(200).json({ message: "hello world" });
  } catch (e) {
    res.status(500).json({ message: "Error retrieving cart", e });
  }
};

export const signUp = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    const token = jwt.sign(
      { userId: user._id },
      process.env["JWT_SECRET"] as string,
      {
        expiresIn: "1h",
      }
    );
    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Registration failed", errors: error.errors });
  }
};

export const signIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Authentication failed" });
    }
    console.log(user.password);
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Authentication failed" });
    }
    const token = jwt.sign(
      { userId: user._id },
      process.env["JWT_SECRET"] as string,
      {
        expiresIn: "1h",
      }
    );
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
};
