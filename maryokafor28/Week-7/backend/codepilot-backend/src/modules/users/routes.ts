// src/modules/users/routes.ts
import { Router } from "express";
import { getProfile, updateProfile } from "./controller";
import { auth } from "../../middlewares/authMiddleware";

const router = Router();

router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateProfile);

export default router;
