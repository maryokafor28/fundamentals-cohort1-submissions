import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";
import { addToCart, getCart } from "../controllers/cartController";

const router = Router();

// Add to cart
router.post("/add-to-cart", authMiddleware, addToCart);

// Get user cart
router.get("/get-cart/:userId", authMiddleware, getCart);

export default router;
