import mongoose, { Schema, Document } from "mongoose";
import { Doctor } from "./doctor.model";
import { Patient } from "./patient.model";
import Report from "./report.model";

export interface IPrescription extends Document {
  doctor: mongoose.Types.ObjectId;
  patient: mongoose.Types.ObjectId;
  report?: mongoose.Types.ObjectId;
  patientName: string;
  doctorName: string;
  medicines: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    notes?: string;
  }[];
  instructions?: string;
  date: Date;
}

const PrescriptionSchema = new Schema<IPrescription>(
  {
    doctor: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    patientName: { type: String, required: true },
    doctorName: { type: String, required: true },
    patient: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    report: {
      type: Schema.Types.ObjectId,
      ref: "Report",
      required: false,
    },
    medicines: [
      {
        name: { type: String, required: true },
        dosage: { type: String, required: true },
        frequency: { type: String, required: true },
        duration: { type: String, required: true },
        notes: { type: String },
      },
    ],
    instructions: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

//
// 🔗 Middleware: Auto-link Prescription to Doctor, Patient, and CaseStudy
//
PrescriptionSchema.post("save", async function (doc) {
  try {
    const prescriptionId = doc._id;
    const { doctor, patient, report } = doc;

    // Add reference to doctor
    await Doctor.findByIdAndUpdate(doctor, {
      $addToSet: { prescriptions: prescriptionId },
    });

    // Add reference to patient
    await Patient.findByIdAndUpdate(patient, {
      $addToSet: { prescriptions: prescriptionId },
    });

    // Link to case study if exists
    if (report) {
      await Report.findByIdAndUpdate(report, {
        $addToSet: { prescriptions: prescriptionId },
      });
    }
  } catch (error) {
    console.error("Error linking prescription:", error);
  }
});

//
// 🗑 Middleware: Remove Prescription link on deletion
//
PrescriptionSchema.post("findOneAndDelete", async function (doc) {
  if (!doc) return;
  try {
    const prescriptionId = doc._id;
    const { doctor, patient, report } = doc;

    // Remove from doctor
    await Doctor.findByIdAndUpdate(doctor, {
      $pull: { prescriptions: prescriptionId },
    });

    // Remove from patient
    await Patient.findByIdAndUpdate(patient, {
      $pull: { prescriptions: prescriptionId },
    });

    // Remove from case study if exists
    if (report) {
      await Report.findByIdAndUpdate(report, {
        $pull: { prescriptions: prescriptionId },
      });
    }
  } catch (error) {
    console.error("Error unlinking prescription:", error);
  }
});

const Prescription = mongoose.model<IPrescription>(
  "Prescription",
  PrescriptionSchema
);
export default Prescription;
