import { Router } from "express";
import { authenticateController } from "../controllers/authentication.conroller";

const router = Router();
router.get("/verify-token", authenticateController);

export default router;
