import { Request, Response } from "express";
import { User } from "../models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();
const jwtSecretKey = process.env.JWT_SECRET_KEY || "your_jwt_secret_key";

const signinController = (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (email === "" || password === "") {
      return res.status(400).send({
        message: "Email and password are required",
        status: 400,
        success: false,
      });
    }

    User.findOne({ email })
      .then(async (user) => {
        if (!user) {
          res.status(401).send({
            message: "Invalid email or password",
            status: 401,
            success: false,
          });
          return;
        }
        try {
          console.log("User found:", user);
          // let isMatch = await bcrypt.compare(password, user.password);
          // if (!isMatch) {
          //   res.status(401).send({
          //     message: "Invalid email or password",
          //     status: 401,
          //     success: false,
          //   });
          //   return;
          // }
          const clientUser = {
            id: user._id,
            email: user.email,
            name: user.name,
          };
          const token = jwt.sign({ user: clientUser }, jwtSecretKey, {
            expiresIn: "1h",
          });
          const url = " http://localhost:3002/api/cart/get-cart";
          const myCarts = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (myCarts.data.success) {
            console.log(myCarts.data.userCarts);
            res.status(200).send({
              message: "User signed in successfully",
              status: 200,
              success: true,
              user: clientUser,
              token,
              cart: myCarts.data.userCarts,
            });
          }
        } catch (error) {
          res.status(500).send({
            message: "Error signing in user",
            status: 500,
            success: false,
          });
          console.log("Error during password comparison:", error);
        }
      })
      .catch((error) => {
        res.status(500).send({
          message: "Error signing in user",
          status: 500,
          success: false,
        });
        console.log("Error during sign-in:", error);
      });
  } catch (error) {
    res.status(500).send({
      message: "Error signing in user",
      status: 500,
      success: false,
    });
    console.log("Unexpected error during sign-in:", error);
  }
};

export { signinController };
