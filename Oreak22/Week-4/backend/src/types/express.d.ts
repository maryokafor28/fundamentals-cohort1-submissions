import { JwtPayload } from "jsonwebtoken";
import { UserDocument } from "../models/user.model";

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
      tokenPayload?: JwtPayload;
    }
  }
}
