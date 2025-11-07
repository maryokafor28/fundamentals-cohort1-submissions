import mongoose, { Document, Schema } from "mongoose";

interface ICartItem {
  productId: string;
  quantity: number;
}

interface ICart extends Document {
    userId: string;
    items: ICartItem[];
}

const cartSchema = new Schema<ICart>({
    userId: {type: String, required: true, unique: true},
    items: [
        {
            productId: {type: String, required: true},
            quantity: {type: Number, required: true, min: 1},
        }
    ]
})


export default mongoose.model<ICart>('Cart', cartSchema);
