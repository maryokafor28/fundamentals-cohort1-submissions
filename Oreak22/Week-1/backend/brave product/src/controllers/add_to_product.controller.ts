import { Request, Response } from "express";
import { Product } from "../models/product.model";

const add_to_product = (req: Request, res: Response) => {
  try {
    const newProduct = new Product(req.body);
    newProduct
      .save()
      .then((product) => {
        res
          .status(201)
          .send({ message: "Product added successfully", success: true });
        console.log(JSON.stringify(Product));
      })
      .catch((error) => {
        console.log(error);
        res.status(400).send({ message: error.message, success: false });
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error", success: false });
  }
};

// const add_many_to_product = async (req: Request, res: Response) => {
//   try {
//     const products = req.body;
//     Product.insertMany(products)
//       .then((response) =>
//         res
//           .status(201)
//           .send({ message: "Products added successfully", success: true })
//       )
//       .catch((error) =>
//         res.status(400).send({ message: error.message, success: false })
//       );
//   } catch (error) {
//     res.status(500).send({ message: "Internal Server Error", success: false });
//   }
// };

export { add_to_product };
