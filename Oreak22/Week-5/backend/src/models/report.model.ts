import mongoose, { Schema, Document } from "mongoose";
import { Doctor } from "./doctor.model";
import { Patient } from "./patient.model";

export interface IReport extends Document {
  doctor: mongoose.Types.ObjectId;
  patient: mongoose.Types.ObjectId;
  doctorName: string;
  patientName: string;
  title: string;
  diagnosis: string;
  symptoms: string[];
  treatment: string;
  notes?: string;
  date: Date;
  prescriptions: mongoose.Types.ObjectId[];
}

const ReportSchema = new Schema<IReport>(
  {
    doctor: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    doctorName: { type: String, required: true },
    patient: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    patientName: { type: String, required: true },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    diagnosis: {
      type: String,
      required: true,
      trim: true,
    },
    symptoms: {
      type: [String],
      default: [],
    },
    treatment: {
      type: String,
      required: true,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    prescriptions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Prescription",
      },
    ],
  },
  { timestamps: true }
);

//
// 🔗 Middleware: Auto-link doctor & patient to the new case study
//
ReportSchema.post("save", async function (doc) {
  try {
    const ReportId = doc._id;
    const doctorId = doc.doctor;
    const patientId = doc.patient;

    // Add to doctor's case studies (if not already linked)
    await Doctor.findByIdAndUpdate(doctorId, {
      $addToSet: { report: ReportId },
    });

    // Add to patient's case studies
    await Patient.findByIdAndUpdate(patientId, {
      $addToSet: { report: ReportId },
    });
  } catch (error) {
    console.error("Error linking case study:", error);
  }
});

//
// 🗑 Middleware: Auto-remove link from doctor & patient when case study deleted
//
ReportSchema.post("findOneAndDelete", async function (doc) {
  if (!doc) return;
  try {
    const ReportId = doc._id;
    const doctorId = doc.doctor;
    const patientId = doc.patient;

    // Remove from doctor's report list
    await Doctor.findByIdAndUpdate(doctorId, {
      $pull: { report: ReportId },
    });

    // Remove from patient's report list
    await Patient.findByIdAndUpdate(patientId, {
      $pull: { report: ReportId },
    });
  } catch (error) {
    console.error("Error unlinking case study:", error);
  }
});

const Report = mongoose.model<IReport>("Report", ReportSchema);
export default Report;
