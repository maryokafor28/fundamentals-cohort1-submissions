import mongoose, { model, Schema } from "mongoose";

const cartSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  vendor: { type: String, required: true },
  cutomerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  image: { type: String, required: true, default: "img:" },
  rating: { type: Number, required: true, default: 0 },
  quatity: { type: Number, required: true, default: 1 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  id: { type: String, required: true },
  productId: { type: String, required: true },
});

export const cart = model("cart", cartSchema);
