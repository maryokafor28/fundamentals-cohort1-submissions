import mongoose, { Document } from "mongoose";
import bcrypt from "bcryptjs";

interface IDoctor extends Document {
  _id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  specialist: string;
  status: string;
  gender: string;
  dob: string;
  bloodGroup: string;
  address: string;
  bio: string;
  image?: string;
  password: string;
  accessToken: string;
  refreshToken: string;
  patients: mongoose.Types.ObjectId[];
  appointments: mongoose.Types.ObjectId[];
  prescriptions: mongoose.Types.ObjectId[];
  report: mongoose.Types.ObjectId[];
  isModified: (path: string) => boolean;
}

const DoctorSchema = new mongoose.Schema<IDoctor>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    department: { type: String, required: true },
    designation: { type: String, required: true },
    specialist: { type: String, required: true },
    status: { type: String, required: true },
    gender: { type: String, required: true },
    dob: { type: String, required: true },
    bloodGroup: { type: String, required: true },
    address: { type: String, required: true },
    bio: { type: String, required: true },
    image: { type: String },
    password: { type: String, required: true },
    accessToken: { type: String },
    refreshToken: { type: String },
    report: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Report",
      },
    ],
    prescriptions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Prescription",
      },
    ],

    appointments: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
    ],

    patients: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
      },
    ],
  },
  { timestamps: true }
);
// Fetch doctor with patient details
// const doctorWithPatients = await Doctor.findById(doctorId).populate("patients");
// await Doctor.findByIdAndUpdate(doctorId, {
//   $push: { patients: patientId },
// });

DoctorSchema.pre("save", async function (this: IDoctor, next) {
  if (this.isModified("password") || this.isNew) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});
const Doctor = mongoose.model<IDoctor>("Doctor", DoctorSchema);
export { Doctor, IDoctor };

export const verifyPassword = async (
  password: string,
  hash: string
): Promise<boolean> => bcrypt.compare(password, hash);

///////////////////////////////////////

const ActivitySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    type: String,
    startTime: Date,
    durationMinutes: Number,
    caloriesBurned: Number,
    notes: String,
  },
  { timestamps: true }
);

const MealItemSchema = new mongoose.Schema({
  name: String,
  calories: Number,
  protein_g: Number,
  carbs_g: Number,
  fats_g: Number,
});

const MealSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    eatenAt: Date,
    totalCalories: Number,
    items: [MealItemSchema],
    notes: String,
  },
  { timestamps: true }
);

// Appointment
const AppointmentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
    scheduledAt: Date,
    status: { type: String, default: "scheduled" },
    reason: String,
  },
  { timestamps: true }
);

// Report
const ReportSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
    title: String,
    content: String,
    reportDate: Date,
  },
  { timestamps: true }
);
