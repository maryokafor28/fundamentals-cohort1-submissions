import mongoose, {Schema, Document} from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  activities: mongoose.Types.ObjectId[];
  meals: mongoose.Types.ObjectId[];
  appointments: mongoose.Types.ObjectId[];
  reports: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number },
  gender: { type: String, enum: ["Male", "Female", "Other"] },
  activities: [{ type: mongoose.Types.ObjectId, ref: "Activity" }],
  meals: [{ type: mongoose.Types.ObjectId, ref: "Meal" }],
  appointments: [{ type: mongoose.Types.ObjectId, ref: "Appointment" }],
  reports: [{ type: mongoose.Types.ObjectId, ref: "Report" }]
}, {timestamps: true});


export default mongoose.model<IUser>("User", UserSchema);
