import { Router } from "express";
import { register, login, getCurrentUser } from "../controllers/authController";
import { authMiddleware } from "../middlewares/auth";

const router = Router();
router.post("/register", register);
router.post("/login", login);
router.get("/onAuthStateChanged", authMiddleware, getCurrentUser);

export default router;
