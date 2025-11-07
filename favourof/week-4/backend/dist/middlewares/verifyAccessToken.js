"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const loggers_1 = require("../utils/loggers");
const config_1 = require("../config/config");
const ACCESS_TOKEN_SECRET = config_1.config.accessToken;
const verifyAccessToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        loggers_1.securityLoggerInstance.warn("ACCESS_DENIED_NO_TOKEN", { ip: req.ip });
        return res.status(401).json({ massage: "No token Provided" });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, ACCESS_TOKEN_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        loggers_1.securityLoggerInstance.warn("ACCESS_DENIED_INVALID_TOKEN", { ip: req.ip });
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};
exports.verifyAccessToken = verifyAccessToken;
