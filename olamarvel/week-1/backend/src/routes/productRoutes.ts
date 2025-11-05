import {Router} from "express"

import {addProduct, getProduct, getProducts, removeProduct} from "../controllers/Products"

const router=Router()
router.post("/add",addProduct)
router.delete("/remove:id",removeProduct)
router.get("/product:id",getProduct)
router.get("/",getProducts)


export default router