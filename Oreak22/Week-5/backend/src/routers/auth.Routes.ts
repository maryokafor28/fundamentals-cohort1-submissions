import express from "express";
import {
  register,
  login,
  refreshToken,
  logout,
} from "../controllers/auth.Controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.post("/logout", authenticate, logout);

export default router;
