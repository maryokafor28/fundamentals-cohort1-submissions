import { Request, Response } from "express";
import { cart } from "../models/cart.model";

const getCartController = (req: Request, res: Response) => {
  //   res.status(200).json({ cartItems: [] });

  try {
    cart
      .find({ id: req.body.id })
      .then((response) => {
        if (response) {
        //   console.log(response);
          res
            .status(200)
            .send({ message: "okay", success: true, userCarts: response });
        } else {
          res
            .status(401)
            .send({ message: "something went wrong", success: false });
        }
      })
      .catch((error) => {
        res
          .status(401)
          .send({ message: "something went wrong", success: false });
      });
  } catch (error) {
    res.status(401).send({ message: "something went wrong", success: false });
  }
};
export default getCartController;
