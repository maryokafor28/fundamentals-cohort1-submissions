import { Request, Response } from "express";
import pkg from "../../package.json";

export const healthCheck = (req: Request, res: Response) => {
  return res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: pkg.name,
    version: pkg.version,
  });
};
