import express from "express";
import {
  createActivity,
  getActivities,
  getActivitiesByUser,
  updateActivity,
  deleteActivity,
} from "../controllers/activityController";

const router = express.Router();

router.post("/", createActivity);
router.get("/", getActivities);
router.get("/user/:userId", getActivitiesByUser);
router.put("/:id", updateActivity);
router.delete("/:id", deleteActivity);

export default router;
