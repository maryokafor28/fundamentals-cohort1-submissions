import mongoose, { Document, Schema, Model } from "mongoose";

export interface IMealItem {
  name: string;
  calories: number;
  quantity: number;
}

export interface IMeal extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  items: IMealItem[];
  totalCalories: number;
  time: Date;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const mealItemSchema = new Schema<IMealItem>({
  name: { type: String, required: true },
  calories: { type: Number, min: 0 },
  quantity: { type: Number, min: 1, default: 1 },
});

const mealSchema = new Schema<IMeal>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    items: { type: [mealItemSchema], default: [] },
    totalCalories: { type: Number, default: 0 },
    time: { type: Date, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Auto calculate total calories
mealSchema.pre("save", function (next) {
  this.totalCalories = this.items.reduce(
    (sum, item) => sum + (item.calories || 0) * (item.quantity || 1),
    0
  );
  next();
});

mealSchema.index({ user: 1, time: -1 });

export const Meal: Model<IMeal> =
  mongoose.models.Meal || mongoose.model<IMeal>("Meal", mealSchema);
