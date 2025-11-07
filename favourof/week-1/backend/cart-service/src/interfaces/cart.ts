import { Document } from "mongoose";

export interface ICart extends Document {
  userId: string;
  productId: Number;
  title: string;
  description: string;
  category: string;
  price: number;
  quantity: number;
  image: string;
  total: Number;
}
