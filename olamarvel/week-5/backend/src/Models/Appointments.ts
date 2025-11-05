import { Schema, model, Document, Types } from "mongoose";

export interface IAppointment extends Document {
  user: Types.ObjectId;
  doctor: Types.ObjectId;
  time: Date;
  notes?: string;
  status: "scheduled" | "completed" | "cancelled";
}

const appointmentSchema = new Schema<IAppointment>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  doctor: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
  time: { type: Date, required: true },
  notes: String,
  status: { type: String, default: "scheduled", enum: ["scheduled", "completed", "cancelled"] }
}, { timestamps: true });

export default model<IAppointment>("Appointment", appointmentSchema);
