import { Request, Response } from "express";
import { cart } from "../models/cart.model";

 const delete_cart = async (req: Request, res: Response) => {
  console.log(req.params.id);
  try {
    const deleted = await cart.findOneAndDelete({ _id: req.params.id });
    const allCart = await cart.find({ id: req.body.id });
    if (!deleted) {
      return res
        .status(404)
        .json({ message: "Item not found", success: false });
    }
    res.status(200).send({
      message: "updated",
      success: true,
      deleted,
      userCart: allCart,
      id: req.params.id,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "someting went wrong", success: false });
  }
};

export default delete_cart