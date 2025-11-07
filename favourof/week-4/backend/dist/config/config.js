"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const envFile = process.env.NODE_ENV === "production" ? ".env.prod" : ".env";
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), envFile) });
exports.config = {
    port: process.env.PORT || 4001,
    nodeEnv: process.env.NODE_ENV || "development",
    mongoUrl: process.env.MONGODB_URL,
    accessToken: process.env.ACCESS_TOKEN_SECRET,
    refreshToken: process.env.REFRESH_TOKEN_SECRET,
    bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 12,
    frontendOrigin: process.env.FRONTEND_ORIGIN,
    cookieDomain: process.env.COOKIE_DOMAIN,
};
