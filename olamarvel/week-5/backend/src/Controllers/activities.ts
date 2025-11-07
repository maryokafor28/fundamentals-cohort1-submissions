import { Response } from "express";
import Activity from "../Models/Activity";
import User from "../Models/User";
import { validationResult } from "express-validator";
import {AuthRequest} from "../Middlewares/protect"

export const createActivity = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    if (!req.body.user) {
      req.body.user = req.user.id;
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const activity = await Activity.create(req.body);
    await User.findByIdAndUpdate(activity.user, { $push: { activities: activity._id }});
    return res.status(201).json({success:true, data:activity});
  } catch (err) {
    return res.status(400).json({ error: (err as Error).message });
  }
};

export const getActivities = async (req: AuthRequest, res: Response):Promise<Response> => {
  const activities = await Activity.find({user:req.user.id}).populate('user');
  return res.json({success:true, data:activities});
};

export const getActivity = async (req: AuthRequest, res: Response):Promise<Response> => {
  const activity = await Activity.findById(req.params.id).populate('user');
  if (!activity) {
    return res.status(404).json({ error: "Activity not found" });
  }
  return res.json({success:true, data:activity});
};