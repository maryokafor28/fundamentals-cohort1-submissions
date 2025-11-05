import { Router } from "express";
import * as activities from "../Controllers/activities";
import { body } from "express-validator";
import { protect } from "../Middlewares/protect";
import asyncHandler from "../Middlewares/aysncHandler";

const router = Router();

router.post("/", [
    protect, 
    body("type").not().isEmpty().withMessage("Type is required").isLength({ min: 3, max: 20 }).withMessage("Type must be a minimum of 3 char. and maximum of 20 "),
    body("description").optional().isLength({ min: 10, max: 200 }), 
    body("durationMinutes").optional().isInt({ min: 1, max: 10000 }), 
    body("caloriesBurned").optional().isInt({ min: 1, max: 10000 })],
    asyncHandler(activities.createActivity));
router.get("/", [protect], asyncHandler(activities.getActivities));
router.get("/:id", [protect], asyncHandler(activities.getActivity))

export default router;
