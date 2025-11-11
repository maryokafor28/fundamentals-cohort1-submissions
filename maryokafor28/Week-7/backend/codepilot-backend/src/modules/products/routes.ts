import { Router } from "express";
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} from "./controller";
import { auth } from "../../middlewares/authMiddleware";

const router = Router();

router.get("/", getProducts);
router.get("/:id", getProduct);

// 🔐 only logged-in users can modify product
router.post("/", auth, createProduct);
router.put("/:id", auth, updateProduct);
router.delete("/:id", auth, deleteProduct);

export default router;
