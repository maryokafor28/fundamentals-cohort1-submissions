import { Router } from "express";
import { login, register, refresh, logout } from "../controllers/authController";
import { asyncWrapper } from "../middleware/asyncWrapper";

const router = Router();

router.post("/register", asyncWrapper(register));
router.post("/login", asyncWrapper(login));
router.get("/refresh", asyncWrapper(refresh));
router.get("/logout", asyncWrapper(logout));

export default router;
