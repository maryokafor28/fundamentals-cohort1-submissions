import { Router } from "express";
import * as Auth from "../Controllers/auth"
import { body } from "express-validator"
import { protect } from "../Middlewares/protect";
import asyncHandler from "../Middlewares/aysncHandler";
const router = Router()

router.get('/getUser', protect, Auth.getUser)

router.post('/register', [
    body("name", "name is required").not().isEmpty(),
    body("email", "Invalid email, a corect email address is required").isEmail(),
    body("password", "password is required").isLength({ min: 8, max: 20 }),
    body("age", "age must be an integer between 13 and 100")
        .notEmpty().withMessage("Age is required")
        .isInt({ min: 13, max: 100 }).withMessage("Age must be between 13 and 100")],
    asyncHandler(Auth.register));

router.post('/login', [
    body("email", "email is required").isEmail(),
    body("password", "password is required").isLength({ min: 8, max: 20 })], asyncHandler(Auth.login));
router.post('/logout', protect, asyncHandler(Auth.logout));
router.post('/refresh', protect, asyncHandler(Auth.refresh));

export default router