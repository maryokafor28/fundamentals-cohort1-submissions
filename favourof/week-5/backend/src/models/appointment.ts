import mongoose, { Document, Schema, Model } from "mongoose";
import { Doctor } from "./doctor";
import { User } from "./user";

export interface IPatientSubdoc {
  name: string;
  email: string;
  notes?: string;
}

export interface IAppointment extends Document {
  user: mongoose.Types.ObjectId;
  doctor: mongoose.Types.ObjectId;
  patients: IPatientSubdoc[];
  appointmentDate: Date;
  status: "scheduled" | "completed" | "cancelled";
  notes?: string;
  cancelledAt?: Date | null;
  isDeleted?: boolean;
}

const patientSubSchema = new Schema<IPatientSubdoc>({
  name: { type: String, required: true },
  email: { type: String, required: true, match: /.+@.+\..+/ },
  notes: { type: String },
});

const appointmentSchema = new Schema<IAppointment>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    doctor: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
    patients: { type: [patientSubSchema], required: true },
    appointmentDate: {
      type: Date,
      required: true,
      validate: {
        validator: (v: Date) => v > new Date(),
        message: "Date must be in the future",
      },
    },
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled"],
      default: "scheduled",
    },
    notes: { type: String },
    cancelledAt: { type: Date, default: null },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

appointmentSchema.index({ doctor: 1, appointmentDate: -1 });
appointmentSchema.index({ user: 1, appointmentDate: -1 });

// Middleware
appointmentSchema.pre("save", async function (next) {
  const doc = this as IAppointment;
  const [doctorExists, userExists] = await Promise.all([
    Doctor.exists({ _id: doc.doctor }),
    User.exists({ _id: doc.user }),
  ]);
  if (!doctorExists) return next(new Error("Doctor not found"));
  if (!userExists) return next(new Error("User not found"));
  next();
});

appointmentSchema.post("save", async function (doc: IAppointment) {
  if (doc.status === "scheduled") {
    await Doctor.findByIdAndUpdate(doc.doctor, {
      $inc: { totalAppointments: 1 },
    });
  }
});

export const Appointment: Model<IAppointment> =
  mongoose.models.Appointment ||
  mongoose.model<IAppointment>("Appointment", appointmentSchema);
