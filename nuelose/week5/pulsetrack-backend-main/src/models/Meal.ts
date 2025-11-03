import mongoose, { Schema, Document } from "mongoose";

export interface IMeal extends Document {
  user: mongoose.Types.ObjectId;
  type: "Breakfast" | "Lunch" | "Dinner" | "Snack";
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  date: Date;
}

const MealSchema: Schema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["Breakfast", "Lunch", "Dinner", "Snack"],
      required: true,
    },
    name: { type: String, required: true },
    calories: { type: Number, required: true },
    protein: {type: Number, default: 0},
    fat: {type: Number, default: 0},
    carbs: {type:Number, default: 0},
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<IMeal>("Meal", MealSchema);
