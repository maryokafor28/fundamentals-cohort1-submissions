import express from "express";
import type { Request, Response } from "express";
import { addToCart, getCart } from "../services/cartservices";

const router = express.Router();

// POST /add-to-cart
router.post("/add-to-cart", async (req: Request, res: Response) => {
  try {
    const cart = await addToCart(req.body); // req.body includes userId, productId, etc.
    res.json(cart);
  } catch (err) {
    console.error("Error in add-to-cart:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// GET /get-cart/:userId
router.get("/get-cart/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const cart = await getCart(userId);
    res.json(cart || { userId, items: [] }); // return empty cart if not found
  } catch (err) {
    console.error("Error in get-cart:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
