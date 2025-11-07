"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserProfile = void 0;
const user_1 = require("../models/user");
const loggers_1 = require("../utils/loggers");
const AppError_1 = __importDefault(require("../utils/AppError"));
const updateUserProfile = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const updates = req.body;
        const allowedFields = [
            "name",
            "avatar",
            "bio",
            "skills",
            "LinkedIn",
            "github",
        ];
        const filteredUpdates = {};
        for (const field of allowedFields) {
            if (updates[field] !== undefined)
                filteredUpdates[field] = updates[field];
        }
        const updatedUser = await user_1.User.findByIdAndUpdate(userId, filteredUpdates, {
            new: true,
            runValidators: true,
        }).select("-password -refreshToken -failedLoginAttempts -lockUntil");
        if (!updatedUser) {
            loggers_1.securityLoggerInstance.warn("INVALID_USER_UPDATE", {
                ip: req.ip,
            });
            if (!updatedUser)
                return next(new AppError_1.default("No user found", 404));
        }
        res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser,
        });
    }
    catch (err) {
        loggers_1.requestLoggerInstance.error("UPDATE USER ERROR", {
            error: err.message,
            ip: req.ip,
        });
        next(err);
    }
};
exports.updateUserProfile = updateUserProfile;
