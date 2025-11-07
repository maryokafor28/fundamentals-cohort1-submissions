"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const config_1 = require("../config/config");
dotenv_1.default.config();
const ACCESS_TOKEN_SECRET = config_1.config.accessToken;
const REFRESH_TOKEN_SECRET = config_1.config.refreshToken;
if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
    throw new Error("Missing ACCESS_TOKEN_SECRET or REFRESH_TOKEN_SECRET");
}
const generateAccessToken = (user) => {
    const payload = { id: user._id, role: user.role };
    const options = { expiresIn: "15m" };
    return jsonwebtoken_1.default.sign(payload, ACCESS_TOKEN_SECRET, options);
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (user) => {
    const payload = { id: user._id };
    const options = { expiresIn: "7d" };
    return jsonwebtoken_1.default.sign(payload, REFRESH_TOKEN_SECRET, options);
};
exports.generateRefreshToken = generateRefreshToken;
