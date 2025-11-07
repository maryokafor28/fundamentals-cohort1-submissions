import express from "express";
import { login, refreshToken, register } from "../controllers/authContoller";
import validateRequest from "../middlewares/validateRequest";
import {
  loginUserValidation,
  registerUserValidation,
} from "../validators/userValidation";

const router = express.Router();

router.post("/register", validateRequest(registerUserValidation), register);
router.post("/refresh", refreshToken);
router.post("/login", validateRequest(loginUserValidation), login);

export default router;
