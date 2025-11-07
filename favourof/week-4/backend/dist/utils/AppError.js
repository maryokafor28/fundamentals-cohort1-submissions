"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
        this.isOperational = true;
        // Preserve correct prototype chain for instanceof checks
        Object.setPrototypeOf(this, new.target.prototype);
        // Capture stack trace (optional for cleaner error logging)
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.default = AppError;
