import express from "express";
import type { Request, Response } from "express";
import { signup, login } from "../controller/authcontroller";

const router = express.Router();

/**
 * POST /auth/register
 * Register a new user
 */
router.post("/register", signup);

/**
 * POST /auth/login
 * Authenticate user and return token
 */
router.post("/login", login);

export default router;
