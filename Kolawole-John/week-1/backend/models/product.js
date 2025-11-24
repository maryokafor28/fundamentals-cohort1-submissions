// models/Product.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    imageUrl: { type: String }, // optional
    createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model("Product", productSchema);

export default Product;
