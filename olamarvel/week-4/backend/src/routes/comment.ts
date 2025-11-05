import {Router} from "express"
import {asyncHandler} from "../middleware/asyncWrapper"
import {protect} from "../middleware/authMiddleware"
import { addComment,deleteComment } from "../controllers/commentController"

const router = Router()

router.post("/:id",asyncHandler(addComment))
router.delete("/:id", protect,asyncHandler(deleteComment))

export default router