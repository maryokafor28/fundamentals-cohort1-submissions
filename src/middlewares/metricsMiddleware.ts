import { Request, Response, NextFunction } from "express";
import {
  httpRequestCounter,
  httpResponseTimeHistogram,
} from "../metrics/metrics";

export default function metricsMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const start = Date.now();

  res.on("finish", () => {
    const duration = (Date.now() - start) / 1000;

    const labels = {
      method: req.method,
      route: req.route ? req.route.path : req.originalUrl,
      status: res.statusCode.toString(),
    };

    // Count request
    httpRequestCounter.inc(labels);

    // Record response time
    httpResponseTimeHistogram.observe(labels, duration);
  });

  next();
}
