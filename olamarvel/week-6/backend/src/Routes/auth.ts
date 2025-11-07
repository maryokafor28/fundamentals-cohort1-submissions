import { Router } from "express";
import * as Auth from "../Controllers/auth";
import { protect } from "../Middlewares/protect";
import asyncHandler from "../Middlewares/aysncHandler";
import validate from "../Middlewares/validate";
import { registerSchema, loginSchema } from "../util/validationSchemas";
import { generalLimiter, strictLimiter } from "../Middlewares/rateLimiter";

const router = Router();
router.use(generalLimiter)

router.get('/getUser', protect, Auth.getUser);

router.post('/register', [strictLimiter, validate(registerSchema)], asyncHandler(Auth.register));

router.post('/login', [strictLimiter, validate(loginSchema)], asyncHandler(Auth.login));

router.post('/logout', protect, asyncHandler(Auth.logout));

router.post('/refresh', protect, asyncHandler(Auth.refresh));

export default router;
