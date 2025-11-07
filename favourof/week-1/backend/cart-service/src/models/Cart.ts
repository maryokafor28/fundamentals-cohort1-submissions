import mongoose, { Schema } from "mongoose";
import { ICart } from "../interfaces/cart";
const CartSchema: Schema<ICart> = new Schema<ICart>(
  {
    userId: { type: String, required: true },
    productId: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, default: 1 },
    image: { type: String, required: true },
    total: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Cart = mongoose.model<ICart>("Cart", CartSchema);
