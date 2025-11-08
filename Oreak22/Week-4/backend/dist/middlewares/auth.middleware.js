"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jwt = require("jsonwebtoken");
const dotenv_1 = __importDefault(require("dotenv"));
const user_models_1 = require("../models/user.models");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
dotenv_1.default.config();
const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer "))
        return res.status(401).json({ message: "No token provided" });
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await user_models_1.User.findById(decoded._id);
        if (!user)
            return res.status(403).send({ message: "user not found" });
        if (!user.accessToken)
            return res.status(403).send({ message: "Invalid" });
        const confirmToken = await bcryptjs_1.default.compare(token, user?.accessToken);
        if (!confirmToken)
            return res.status(401).send({ message: "Expired or invalid token " });
        req.user = decoded;
        next();
    }
    catch (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};
exports.authenticate = authenticate;
