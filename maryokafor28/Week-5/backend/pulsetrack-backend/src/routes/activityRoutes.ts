import express from "express";
import * as activityController from "../controllers/activityController";

const router = express.Router();

router.post("/", activityController.createActivity);
router.get("/", activityController.getAllActivities);
router.get("/:id", activityController.getActivityById);
router.put("/:id", activityController.updateActivity);
router.delete("/:id", activityController.deleteActivity);

export default router;
