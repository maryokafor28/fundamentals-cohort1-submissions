import mongoose, { Schema, Document } from "mongoose";

export interface IReport extends Document {
  user: mongoose.Types.ObjectId;
  type: string;
  summary: string;
  reportDate: Date;
}

const ReportSchema: Schema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, required: true },
    summary: { type: String },
    reportDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<IReport>("Report", ReportSchema);
