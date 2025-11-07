import mongoose, { Document, Schema, Model } from "mongoose";

export interface IActivity extends Document {
  user: mongoose.Types.ObjectId;
  type: string;
  durationMinutes: number;
  calories: number;
  metadata?: Record<string, any>;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const activitySchema = new Schema<IActivity>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, required: true },
    durationMinutes: { type: Number, min: 0, required: true },
    calories: { type: Number, min: 0, required: true },
    metadata: { type: Schema.Types.Mixed, default: {} },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

activitySchema.index({ user: 1, createdAt: -1 });

// soft-delete pre-find middleware
activitySchema.pre(/^find/, function (this: any, next) {
  if (!this.getQuery().includeDeleted) {
    this.where({ isDeleted: false });
  }
  next();
});

export const Activity: Model<IActivity> =
  mongoose.models.Activity ||
  mongoose.model<IActivity>("Activity", activitySchema);
