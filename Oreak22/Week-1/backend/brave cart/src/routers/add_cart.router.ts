import { Router } from "express";
import addToCartController from "../contollers/add_to_cart.controller";
import { authorise } from "../middlewares/authorise";
import edit_cart from "../contollers/edit_cart";
import delete_cart from "../contollers/delete_cart.controller";

const router = Router();

router.post("/add-to-cart", addToCartController);

router.get("/edit-quantity/:token", authorise, edit_cart);

router.delete("/delete-cart/:id", authorise, delete_cart);

export default router;
