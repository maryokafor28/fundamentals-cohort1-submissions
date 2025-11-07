import winston from "winston";
import "winston-daily-rotate-file";
import path from "path";
const logDir = path.join(process.cwd(), "logs");

// helper to create a rotating file transport
const createTransport = (filename: string, level: string) =>
  new winston.transports.DailyRotateFile({
    filename: path.join(logDir, `${filename}-%DATE%.log`),
    datePattern: "YYYY-MM-DD",
    maxFiles: "14d",
    zippedArchive: true,
    level,
  });

// Base format for all logs
const baseFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
);

// separate logger instances
export const requestLoggerInstance = winston.createLogger({
  level: "info",
  format: baseFormat,
  transports: [
    createTransport("requests", "info"),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ level, message, timestamp, ...meta }) => {
          return `${timestamp} [${level}] ${message} ${JSON.stringify(meta)}`;
        })
      ),
    }),
  ],
});

export const securityLoggerInstance = winston.createLogger({
  level: "info",
  format: baseFormat,
  transports: [
    createTransport("security", "info"),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ level, message, timestamp, ...meta }) => {
          return `${timestamp} [${level}] ${message} ${JSON.stringify(meta)}`;
        })
      ),
    }),
  ],
});

export const errorLoggerInstance = winston.createLogger({
  level: "error",
  format: baseFormat,
  transports: [
    createTransport("error", "error"),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ level, message, timestamp, ...meta }) => {
          return `${timestamp} [${level}] ${message} ${JSON.stringify(meta)}`;
        })
      ),
    }),
  ],
});
