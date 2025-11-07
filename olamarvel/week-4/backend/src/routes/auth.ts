import { Router } from "express";
import { login, register, refresh, logout } from "../controllers/authController";
import { asyncHandler } from "../middleware/asyncWrapper";

const router = Router();

router.post("/register", asyncHandler(register));
router.post("/login", asyncHandler(login));
router.get("/refresh", asyncHandler(refresh));
router.get("/logout", asyncHandler(logout));

export default router;
