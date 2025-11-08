import axios from "axios";
import { NextFunction, Request, response, Response } from "express";

const authorise = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    try {
      axios
        .get("http://localhost:3001/api/auth/verify-token", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          //   console.log(response.data, "hell");
          if (response.data.success) {
            req.body = response.data.decoded.user;
            next();
          } else {
            res.status(403).send({ message: "Forbidden", success: false });
          }
        });
    } catch (error) {
      return res.status(403).send({ message: "Forbidden", success: false });
    }
  } else {
    res.status(401).send({ message: "Unauthorized", success: false });
  }
};

export { authorise };
