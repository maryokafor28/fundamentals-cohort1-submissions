import { Request, Response } from "express";
import * as activityService from "../services/activityService";

export async function createActivity(req: Request, res: Response) {
  try {
    const activity = await activityService.createActivity(req.body);
    res.status(201).json({ success: true, data: activity });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}

export async function getAllActivities(req: Request, res: Response) {
  try {
    const activities = await activityService.getAllActivities();
    res.json({ success: true, data: activities });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function getActivityById(req: Request, res: Response) {
  try {
    const activity = await activityService.getActivityById(req.params.id);
    if (!activity)
      return res
        .status(404)
        .json({ success: false, message: "Activity not found" });
    res.json({ success: true, data: activity });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function updateActivity(req: Request, res: Response) {
  try {
    const updated = await activityService.updateActivity(
      req.params.id,
      req.body
    );
    if (!updated)
      return res
        .status(404)
        .json({ success: false, message: "Activity not found" });
    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}

export async function deleteActivity(req: Request, res: Response) {
  try {
    const deleted = await activityService.deleteActivity(req.params.id);
    if (!deleted)
      return res
        .status(404)
        .json({ success: false, message: "Activity not found" });
    res.json({ success: true, message: "Activity deleted" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}
