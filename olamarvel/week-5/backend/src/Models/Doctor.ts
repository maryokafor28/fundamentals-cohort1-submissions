import { Schema, model, Document } from "mongoose";

export interface IDoctor extends Document {
  name: string;
  specialty?: string;
  contact?: string;
}

const doctorSchema = new Schema<IDoctor>({
  name: { type: String, required: true },
  specialty: String,
  contact: String
}, { timestamps: true });

export default model<IDoctor>("Doctor", doctorSchema);
