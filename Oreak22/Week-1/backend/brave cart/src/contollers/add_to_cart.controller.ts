import axios from "axios";
import { Request, response, Response } from "express";
import { cart } from "../models/cart.model";

const productDB_URL = "http://localhost:3003/api/get-product-one";

const addToCartController = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const productId = req.body.productId;

    if (!token || !productId) {
      return res.status(400).json({ message: "Missing token or productId" });
    }

    const response = await axios.get(productDB_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
        Id: req.body.productId,
      },
    });

    const { user, productData } = response.data;
    // console.log(user, productData);

    if (!user || !productData) {
      return res.status(404).send({ message: "User or product not found" });
    }

    const { name, description, price, category, vendor, image, rating, _id } =
      productData;

    const newCart = new cart({
      name,
      description,
      price,
      category,
      vendor,
      image,
      cutomerId: user.id,
      rating,
      id: user.id,
      productId: _id,
    });

    const feedBack = await newCart.save();

    console.log("feedBack", feedBack);

    if (feedBack) {
      const usersCart = await cart.find({ id: user.id });
      console.log("feedBackCarts", usersCart);
      res.status(201).send({
        message: "Product added to cart successfully",
        success: true,
        usersCart,
      });
    }
  } catch (error) {
    console.error("Error in addToCartController:", error);
    return res.status(500).send({
      message: "Something went wrong",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
export default addToCartController;

//  _id: '68d42061d2f5e39d22f7d9d8',
//     name: 'erfwsrf',
//     description: 'wdedf',
//     price: 0,
//     category: 'Accessories',
//     stock: 0,
//     vendor: '68d36f19cf0eecdab5370df3',
//     image: 'img:',
//     rating: 0,
//     createdAt: '2025-09-24T16:46:26.003Z',
//     updatedAt: '2025-09-24T16:46:26.003Z',
//     __v: 0

//  name: { type: String, required: true },
//   description: { type: String, required: true },
//   price: { type: Number, required: true },
//   category: { type: String, required: true },
//   vendor: { type: String, required: true },
//   image: { type: String, required: true, default: "img:" },
//   rating: { type: Number, required: true, default: 0 },
//   quatity: { type: Number, required: true, default: 1 },
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now },
//   id: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
