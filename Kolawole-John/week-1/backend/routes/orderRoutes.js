// routes/orderRoutes.js
import express from "express";
import { placeOrder, getUserOrders, getAllOrders } from "../controllers/orderController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// User routes
router.post("/", authMiddleware, placeOrder); // checkout
router.get("/", authMiddleware, getUserOrders);

// Admin route (later you can secure this with an isAdmin middleware)
router.get("/all", getAllOrders);

export default router;
