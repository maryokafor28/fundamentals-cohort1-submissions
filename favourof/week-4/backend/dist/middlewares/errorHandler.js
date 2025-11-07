"use strict";
// src/middlewares/errorHandler.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const loggers_1 = require("../utils/loggers");
const globalErrorHandler = (err, req, res) => {
    const statusCode = err.statusCode || 500;
    const status = err.status || "error";
    // Log error details
    loggers_1.errorLoggerInstance.error("APP_ERROR", {
        message: err.message,
        stack: err.stack,
        path: req.originalUrl,
        method: req.method,
        statusCode,
        ip: req.ip,
    });
    // Return JSON response
    res.status(statusCode).json({
        status,
        message: err.message || "Something went wrong",
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
};
exports.globalErrorHandler = globalErrorHandler;
