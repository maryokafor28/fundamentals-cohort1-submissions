// src/controllers/cart.controller.ts
import type { Request, Response } from "express";
import { addToCart, getCart as getCartService } from "../services/cartservices";

export class CartController {
  /**
   * GET /cart/:userId
   * Fetch cart for a specific user
   */
  getCart = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { userId } = req.params;
      if (!userId) {
        return res.status(400).json({ message: "userId required" });
      }

      const cart = await getCartService(userId);
      if (!cart) {
        return res.json({ userId, items: [] });
      }

      return res.json(cart);
    } catch (err) {
      console.error("Error in getCart:", err);
      return res.status(500).json({ message: "Server error" });
    }
  };

  /**
   * POST /cart/add-item
   * Add item to cart (or update qty if exists)
   */
  addItem = async (req: Request, res: Response): Promise<Response> => {
    try {
      const {
        userId,
        productId,
        name,
        price,
        quantity = 1,
        description = "",
      } = req.body;

      if (!userId || !productId || !price) {
        return res.status(400).json({
          message: "userId, productId and price are required",
        });
      }

      const cart = await addToCart({
        userId,
        productId,
        name,
        price,
        quantity,
        description,
      });

      return res.json(cart);
    } catch (err) {
      console.error("Error in addItem:", err);
      return res.status(500).json({ message: "Server error" });
    }
  };
}

export const cartController = new CartController();
