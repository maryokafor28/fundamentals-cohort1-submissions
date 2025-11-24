// routes/cartRoutes.js
import express from "express";
import {
    getCartItems,
    addCartItem,
    updateCartItem,
    deleteCartItem
} from "../controllers/cartController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require a valid token
router.use(authMiddleware);

// Get all cart items for logged-in user
router.get("/", getCartItems);

// Add a new cart item
router.post("/", addCartItem);

// Update quantity of a cart item
router.put("/:id", updateCartItem);

// Delete a cart item
router.delete("/:id", deleteCartItem);

export default router;
