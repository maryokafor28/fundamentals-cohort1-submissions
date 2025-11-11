import pinoHttp from "pino-http";
import { logger } from "../logger/pino";

export const requestLogger = pinoHttp({
  logger,
  autoLogging: true, // automatically logs requests/responses
  customLogLevel: function (_req, res, err) {
    if (res.statusCode >= 500 || err) return "error";
    if (res.statusCode >= 400) return "warn";
    return "info";
  },
});
