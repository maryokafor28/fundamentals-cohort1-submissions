import { Schema, model, Document, Types } from "mongoose";

export interface IActivity extends Document {
  user: Types.ObjectId;
  type: string;
  durationMinutes: number;
  caloriesBurned?: number;
  description?:string;
  timestamp: Date;
}

const activitySchema = new Schema<IActivity>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, required: true },
  durationMinutes: { type: Number, required: true },
  caloriesBurned: Number,
  description: String,
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

export default model<IActivity>("Activity", activitySchema);
