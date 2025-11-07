import express from "express";
import { updateUserProfile } from "../controllers/userContoller";
import { verifyAccessToken } from "../middlewares/verifyAccessToken";
import validateRequest from "../middlewares/validateRequest";
import { updateUserValidation } from "../validators/userValidation";

const router = express.Router();

router.patch(
  "/update",
  verifyAccessToken,
  validateRequest(updateUserValidation),
  updateUserProfile
);

export default router;
