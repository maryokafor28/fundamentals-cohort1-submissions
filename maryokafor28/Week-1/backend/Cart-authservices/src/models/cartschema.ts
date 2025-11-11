import { Schema, model, Document } from "mongoose";

export interface CartItem {
  productId: string;
  quantity: number;
  description?: string | null;
  price: number;
  name: string;
  imageUrl?: string;
}
export interface CartDocument extends Document {
  userId: string;
  items: CartItem[];
  totalPrice: number;

  description: string | number | null;
}
const cartSchema = new Schema<CartDocument>({
  userId: { type: String, required: true },
  items: [
    {
      productId: { type: String },
      name: { type: String },
      price: { type: Number },
      description: { type: String },
      quantity: { type: Number, default: 1 },
      imageUrl: { type: String },
    },
  ],
});

export default model<CartDocument>("Cart", cartSchema);
