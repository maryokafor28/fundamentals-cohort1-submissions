// models/CartItem.js
import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    quantity: { type: Number, default: 1 },
    dateAdded: { type: Date, default: Date.now },
});

const CartItem = mongoose.model("CartItem", cartItemSchema);

export default CartItem;
