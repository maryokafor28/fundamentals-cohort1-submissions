import express from "express";
import { refreshAccessToken, logoutUser } from "../controllers/tokenController";

const router = express.Router();

router.post("/refresh", refreshAccessToken);
router.post("/logout", logoutUser); // optional

export default router;
