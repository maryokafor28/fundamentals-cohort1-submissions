import express from "express";
import {
  getCart,
  addToCart,
  signIn,
  signUp,
} from "../controllers/cartController";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();

console.log("Cart routes loaded");
router.post("/add-to-cart", authMiddleware, addToCart);
router.get("/get-cart", authMiddleware, getCart);
router.post("/signin", signIn);
router.post("/signup", signUp);


export default router;
