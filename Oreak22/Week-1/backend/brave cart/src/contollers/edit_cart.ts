import { Request, Response } from "express";
import { cart } from "../models/cart.model";

const edit_cart = async (req: Request, res: Response) => {
  console.log(req.params.token);
  try {
    const updated = await cart.findByIdAndUpdate(
      req.params.token,
      {
        quatity: Number(req.headers.quantity),
      },
      { new: true }
    );

    const allCart = await cart.find({ id: req.body.id });
    res.status(200).send({
      message: "updated",
      success: true,
      updated,
      userCart: allCart,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "someting went wrong", success: false });
  }
};



export default edit_cart;
