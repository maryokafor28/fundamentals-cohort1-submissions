import Router from "express";
import { add_to_product } from "../controllers/add_to_product.controller";
const router = Router();

router.post("/add-to-product", add_to_product);
// router.get("/get-product", getProduct);

export default router;
