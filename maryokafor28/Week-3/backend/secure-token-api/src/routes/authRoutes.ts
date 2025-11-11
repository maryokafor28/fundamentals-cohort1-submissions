import express from "express";
import { registerUser, loginUser } from "../controllers/authController";

const router = express.Router();

// User Registration
router.post("/register", registerUser);

// User Login
router.post("/login", loginUser);

export default router;
