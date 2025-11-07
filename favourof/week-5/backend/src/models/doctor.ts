import mongoose, { Document, Schema, Model } from "mongoose";

export interface IDoctor extends Document {
  name: string;
  email: string;
  specialty: string;
  totalAppointments: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const doctorSchema = new Schema<IDoctor>(
  {
    name: { type: String, required: true, minlength: 2, trim: true },
    email: { type: String, required: true, unique: true, match: /.+@.+\..+/ },
    specialty: { type: String, default: "General" },
    totalAppointments: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

doctorSchema.index({ specialty: 1 });

export const Doctor: Model<IDoctor> =
  mongoose.models.Doctor || mongoose.model<IDoctor>("Doctor", doctorSchema);
