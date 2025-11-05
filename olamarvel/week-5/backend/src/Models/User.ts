import { Schema, model, Document, Types } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  age?: number;
  activities: Types.ObjectId[];
  meals: Types.ObjectId[];
  appointments: Types.ObjectId[];
  reports: Types.ObjectId[];
  password: string;
  refreshTokens: { jti: string; token: string }[];
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: Number,
  activities: [{ type: Schema.Types.ObjectId, ref: "Activity" }],
  meals: [{ type: Schema.Types.ObjectId, ref: "Meal" }],
  appointments: [{ type: Schema.Types.ObjectId, ref: "Appointment" }],
  reports: [{ type: Schema.Types.ObjectId, ref: "Report" }],
  password: { type: String, required: true },
  refreshTokens: [
    {
      jti: String,
      token: String,
    },
  ],
}, { timestamps: true });

export default model<IUser>("User", userSchema);
