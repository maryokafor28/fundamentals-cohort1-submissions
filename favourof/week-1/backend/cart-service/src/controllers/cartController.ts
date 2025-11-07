import { Response } from "express";
import { Cart } from "../models/Cart";
import { AuthRequest } from "../interfaces/user";

// POST /add-to-cart
export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    let total;

    const { productId, title, description, category, price, quantity, image } =
      req.body;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const existingItem = await Cart.findOne({ userId: req.user.id, productId });

    if (existingItem) {
      existingItem.quantity += Number(quantity) || 1;
      total = existingItem.price * existingItem.quantity;
      existingItem.total = total;

      await existingItem.save();
      return res.json({ message: "Cart updated", cartItem: existingItem });
    }

    const newItem = new Cart({
      userId: req.user.id,
      productId,
      title,
      description,
      category,
      price,
      quantity: Number(quantity) || 1,
      image,
      total,
    });
    await newItem.save();
    res.status(201).json({ message: "Item added to cart", cartItem: newItem });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// GET /get-cart/:userId
export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.id !== req.params.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const cartItems = await Cart.find({ userId: req.user.id });
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
