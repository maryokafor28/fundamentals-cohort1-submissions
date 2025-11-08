import { Request, Response } from "express";
import { User } from "../models/user.model";

const registerController = (req: Request, res: Response) => {
  console.log(req.body);
  const newUser = new User(req.body);
  try {
    newUser.save().then(() => {
      console.log("User registered");
      res.status(201).send({
        message: "User registered successfully",
        status: 201,
        success: true,
      });
    });
  } catch (error) {
    res.status(500).send({
      message: "Error registering user",
      status: 500,
      success: false,
    });
  }
};

export { registerController };
