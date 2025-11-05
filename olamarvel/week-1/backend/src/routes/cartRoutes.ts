import {Router} from "express"

import {addToCart, getCartItems, removeFromCart} from "../controllers/cart"

const router=Router()
router.post("/add",addToCart)
router.delete("/remove",removeFromCart)
router.get("/",getCartItems)

export default router