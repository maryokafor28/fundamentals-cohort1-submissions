"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorLoggerInstance = exports.securityLoggerInstance = exports.requestLoggerInstance = void 0;
const path_1 = __importDefault(require("path"));
const winston_1 = __importDefault(require("winston"));
require("winston-daily-rotate-file");
const logDir = path_1.default.join(process.cwd(), "logs");
const createTransport = (filename, level) => new winston_1.default.transports.DailyRotateFile({
    filename: path_1.default.join(logDir, `${filename}-%DATE%.log`),
    datePattern: "YYYY-MM-DD-HH",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
    level,
});
// Base format for all logs
const baseFormat = winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json());
// separate logger instances
exports.requestLoggerInstance = winston_1.default.createLogger({
    level: "info",
    format: baseFormat,
    transports: [
        createTransport("requests", "info"),
        new winston_1.default.transports.Console({
            format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.printf(({ level, message, timestamp, ...meta }) => {
                return `${timestamp} [${level}] ${message} ${JSON.stringify(meta)}`;
            })),
        }),
    ],
});
exports.securityLoggerInstance = winston_1.default.createLogger({
    level: "info",
    format: baseFormat,
    transports: [
        createTransport("security", "info"),
        new winston_1.default.transports.Console({
            format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.printf(({ level, message, timestamp, ...meta }) => {
                return `${timestamp} [${level}] ${message} ${JSON.stringify(meta)}`;
            })),
        }),
    ],
});
exports.errorLoggerInstance = winston_1.default.createLogger({
    level: "info",
    format: baseFormat,
    transports: [
        createTransport("error", "error"),
        new winston_1.default.transports.Console({
            format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.printf(({ level, message, timestamp, ...meta }) => {
                return `${timestamp} [${level}] ${message} ${JSON.stringify(meta)}`;
            })),
        }),
    ],
});
