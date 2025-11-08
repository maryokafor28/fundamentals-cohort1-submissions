import { get } from "http";
import router from "./add_to_product.router";
import {
  getProductController,
  getProductOneController,
} from "../controllers/get_product.controller";
import { authorise } from "../middleware/authorise";

router.get("/get-product", getProductController);
router.get("/get-product-one", authorise, getProductOneController);

export default router;
