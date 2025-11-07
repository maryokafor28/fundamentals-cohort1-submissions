"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("../config/config");
const loggers_1 = require("../utils/loggers");
const connectDB = async () => {
    try {
        await mongoose_1.default.connect(config_1.config.mongoUrl);
        loggers_1.requestLoggerInstance.info("🟢 MongoDB connected successfully");
    }
    catch (err) {
        loggers_1.errorLoggerInstance.error("🔴 MongoDB connection error", err);
    }
};
exports.connectDB = connectDB;
