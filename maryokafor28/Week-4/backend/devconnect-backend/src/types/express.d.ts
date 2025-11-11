import { IUser } from "../models/users";
import { Request } from "express";

declare module "express-serve-static-core" {
  interface Request {
    user?: IUser & { _id: string }; // or Types.ObjectId if you prefer
  }
}
