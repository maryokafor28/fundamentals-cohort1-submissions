import { Response, Request } from "express";
import Cart from "../models/Cart";
import { Types } from "mongoose";


export async function addToCart(req: Request, res: Response) {
  try {
    const { userId, productId } = req.body;

    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid userId or productId" });
    }

    
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, products: [productId] });
    } else {
      cart.products.push(productId);
    }

    const savedCart = await cart.save();
    res.status(201).json(savedCart);
  } catch (error) {
    res.status(500).json({ message: "Error adding to cart", error });
  }
}


export async function removeFromCart(req: Request, res: Response) {
  try {
    const { userId, productId } = req.body;

    const cart = await Cart.findOneAndUpdate(
      { userId },
      { $pull: { products: productId } },
      { new: true }
    );

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error removing from cart", error });
  }
}


export async function getCartItems(req: Request, res: Response) {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOne({ userId }).populate("products");
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart items", error });
  }
}
