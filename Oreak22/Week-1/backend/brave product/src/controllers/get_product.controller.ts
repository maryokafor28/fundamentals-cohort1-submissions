import { Request, Response } from "express";
import { Product } from "../models/product.model";
import { error } from "console";

const getProductController = (req: Request, res: Response) => {
  console.log("Get Product Controller");
  try {
    Product.find()
      .then((products) =>
        res.status(200).send({
          message: "Products fetched successfully",
          success: true,
          data: products,
        })
      )
      .catch((error) => {
        console.log(error);
        res.status(400).send({ message: error.message, success: false });
      });
  } catch (error) {
    {
      console.log(error);
      res
        .status(500)
        .send({ message: "Internal Server Error", success: false });
    }
  }
};
const getProductOneController = (req: Request, res: Response) => {
  try {
    Product.findOne({ _id: req.headers.id })
      .then((products) => {
        console.log(products);
        res.status(200).send({
          message: "Products fetched successfully",
          success: true,
          productData: products,
          user: req.body,
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(400).send({ message: error.message, success: false });
      });
  } catch (error) {
    {
      console.log(error);
      res
        .status(500)
        .send({ message: "Internal Server Error", success: false });
    }
  }
};

export { getProductController, getProductOneController };
