import mongoose, { Document, Schema } from "mongoose";
import { Doctor } from "./doctor.model";

interface IPatient extends Document {
  _id: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  dob: string;
  bloodGroup: string;
  address: string;
  report?: mongoose.Types.ObjectId[];
  doctor: mongoose.Types.ObjectId;
  appointments: mongoose.Types.ObjectId[];
  prescriptions: mongoose.Types.ObjectId[];
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const PatientSchema = new Schema<IPatient>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    gender: { type: String, required: true },
    dob: { type: String, required: true },
    bloodGroup: { type: String, required: true },
    address: { type: String, required: true },
    appointments: [{ type: Schema.Types.ObjectId, ref: "Appointment" }],
    report: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Report",
      },
    ],
    status: { type: String, default: "active" },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
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

PatientSchema.post("save", async function (doc) {
  try {
    await Doctor.findByIdAndUpdate(doc.doctor, {
      $addToSet: { patients: doc._id },
    });
  } catch (err) {
    console.error("Error adding patient to doctor:", err);
  }
});

PatientSchema.pre("findOneAndDelete", async function (next) {
  try {
    const patient: any = await this.model.findOne(this.getQuery());
    if (patient?.doctor) {
      await Doctor.findByIdAndUpdate(patient.doctor, {
        $pull: { patients: patient._id },
      });
    }
    next();
  } catch (err) {
    console.error("Error removing patient from doctor:", err);
    next();
  }
});
export const Patient = mongoose.model<IPatient>("Patient", PatientSchema);
export { IPatient };
