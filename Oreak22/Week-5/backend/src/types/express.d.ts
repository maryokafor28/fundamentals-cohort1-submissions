import { JwtPayload } from "jsonwebtoken";
import { IDoctor } from "../models/doctor.model";
// import { UserDocument } from "../models/user.model";

declare global {
  namespace Express {
    interface Request {
      user?: IDoctor;
      tokenPayload?: JwtPayload;
    }
  }
}
