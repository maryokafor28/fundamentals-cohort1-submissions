import { Router } from "express";

// Import module routes
import authRoutes from "../modules/auth/routes";
import userRoutes from "../modules/users/routes";
import productRoutes from "../modules/products/routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/products", productRoutes);

export default router;
