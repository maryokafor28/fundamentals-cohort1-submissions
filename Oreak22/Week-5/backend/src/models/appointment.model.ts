import mongoose, { Schema, Document, Types } from "mongoose";
import { Doctor } from "./doctor.model";
import { Patient } from "./patient.model";

export interface IAppointment extends Document {
  doctor: Types.ObjectId;
  patient: Types.ObjectId;
  appointmentDate: Date;
  appointmentTime: string;
  patientName: string;
  doctorName: string;
  reason: string;
  status: "scheduled" | "completed" | "cancelled";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema = new Schema<IAppointment>(
  {
    doctor: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    patient: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    patientName: { type: String, required: true },
    doctorName: { type: String, required: true },
    appointmentDate: {
      type: Date,
      required: true,
    },
    appointmentTime: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
    },
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled"],
      default: "scheduled",
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

//
// 🔁 Middleware: Add appointment ref to Doctor & Patient after save
//
AppointmentSchema.post("save", async function (doc) {
  try {
    // Link appointment to doctor
    await Doctor.findByIdAndUpdate(doc.doctor, {
      $addToSet: { appointments: doc._id },
    });

    // Link appointment to patient
    await Patient.findByIdAndUpdate(doc.patient, {
      $addToSet: { appointments: doc._id },
    });
  } catch (err) {
    console.error("Error linking appointment:", err);
  }
});

//
// 🗑 Middleware: Remove appointment from Doctor & Patient on delete
//
AppointmentSchema.post("findOneAndDelete", async function (doc) {
  if (!doc) return;
  try {
    await Doctor.findByIdAndUpdate(doc.doctor, {
      $pull: { appointments: doc._id },
    });

    await Patient.findByIdAndUpdate(doc.patient, {
      $pull: { appointments: doc._id },
    });
  } catch (err) {
    console.error("Error removing appointment references:", err);
  }
});

const Appointment = mongoose.model<IAppointment>(
  "Appointment",
  AppointmentSchema
);

export default Appointment;
