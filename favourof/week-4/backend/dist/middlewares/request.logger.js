"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = void 0;
const loggers_1 = require("../utils/loggers");
const requestLogger = (req, res, next) => {
    const start = Date.now();
    res.on("finsish", () => {
        const duration = Date.now() - start;
        loggers_1.requestLoggerInstance.info("HTTP_REQUEST", {
            method: req.method,
            url: req.originalUrl,
            ip: req.ip,
            duration: `${duration}ms`,
            statusCode: res.statusCode,
        });
    });
    next();
};
exports.requestLogger = requestLogger;
