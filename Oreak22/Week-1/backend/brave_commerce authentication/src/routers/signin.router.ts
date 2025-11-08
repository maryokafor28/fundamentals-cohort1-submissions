import { Router } from "express";
import { signinController } from "../controllers/signin.controller";

const router = Router();

router.post("/signin", signinController);
export default router;
