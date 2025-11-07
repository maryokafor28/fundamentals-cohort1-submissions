import mongoose, { Document, Schema, Model } from "mongoose";

export interface IReport extends Document {
  user: mongoose.Types.ObjectId;
  doctor?: mongoose.Types.ObjectId;
  title: string;
  body: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const reportSchema = new Schema<IReport>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    doctor: { type: Schema.Types.ObjectId, ref: "Doctor" },
    title: { type: String, required: true },
    body: { type: String, required: true },
  },
  { timestamps: true }
);

reportSchema.index({ user: 1, createdAt: -1 });

export const Report: Model<IReport> =
  mongoose.models.Report || mongoose.model<IReport>("Report", reportSchema);
