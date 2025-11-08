import { Request, Response } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();
const authenticateController = (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      console.log("No token provided in headers");
      return res.status(401).send({
        message: "No token provided",
        status: 401,
        success: false,
      });
    }
    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    const decoded = jwt.verify(token, jwtSecretKey || "secret_key");
    console.log("Decoded token:", decoded);
    res.status(200).send({
      message: "Token is valid",
      status: 200,
      success: true,
      decoded,
    });
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).send({
      message: "Invalid token",
      status: 401,
      success: false,
    });
  }
  console.log(req.headers);
};

export { authenticateController };
