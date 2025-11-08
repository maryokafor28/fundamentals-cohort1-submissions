import getCartController from "../contollers/get_cart.controller";
import { authorise } from "../middlewares/authorise";
import router from "./add_cart.router";

router.get("/get-cart", authorise, getCartController);

export default router;
