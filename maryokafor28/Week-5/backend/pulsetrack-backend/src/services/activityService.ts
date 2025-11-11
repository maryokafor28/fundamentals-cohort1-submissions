import { Activity, IActivity } from "../models/Activity";

export async function createActivity(
  activityData: IActivity
): Promise<IActivity> {
  const activity = new Activity(activityData);
  return await activity.save();
}

export async function getAllActivities(): Promise<IActivity[]> {
  return Activity.find().populate("user").exec();
}

export async function getActivityById(id: string): Promise<IActivity | null> {
  return Activity.findById(id).populate("user").exec();
}

export async function updateActivity(
  id: string,
  updateData: Partial<IActivity>
): Promise<IActivity | null> {
  return Activity.findByIdAndUpdate(id, updateData, { new: true })
    .populate("user")
    .exec();
}

export async function deleteActivity(id: string): Promise<IActivity | null> {
  return Activity.findByIdAndDelete(id).populate("user").exec();
}
