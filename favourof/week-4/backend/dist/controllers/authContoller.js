"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.refreshToken = exports.login = exports.register = void 0;
const user_1 = require("../models/user");
const loggers_1 = require("../utils/loggers");
const authService_1 = require("../services/authService");
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = require("../config/config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ maessage: "All field is required " });
        }
        const existingUser = await user_1.User.findOne({ email });
        if (existingUser) {
            loggers_1.securityLoggerInstance.warn("REGISTER_FAILED_EXISTING_USER", {
                email,
                ip: req.ip,
            });
            return res.status(400).json({
                message: "User already exist",
            });
        }
        const newUser = await user_1.User.create({ name, email, password });
        const accessToken = (0, authService_1.generateAccessToken)(newUser);
        res.status(200).json({
            message: "Registration successful",
            user: { id: newUser._id, name: newUser.name, email: newUser.email },
            accessToken,
        });
    }
    catch (error) { }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res
                .status(400)
                .json({ message: "Email and password are required" });
        }
        const user = await user_1.User.findOne({ email }).select("+password +refreshToken");
        if (!user) {
            loggers_1.securityLoggerInstance.warn("LOGIN_FAIL_INVALID_CRED", {
                email,
                ip: req.ip,
            });
            return res.status(400).json({ message: "Invalid credentials" });
        }
        // 🧩 Step 1: Check if user is locked
        if (user.lockUntil && user.lockUntil > new Date()) {
            const unlockTime = Math.ceil((user.lockUntil.getTime() - Date.now()) / 60000);
            loggers_1.securityLoggerInstance.warn("LOGIN_FAIL_ACCOUNT_LOCKED", {
                email,
                unlockTime,
                ip: req.ip,
            });
            return res.status(403).json({
                message: `Account locked. Try again in ${unlockTime} minutes.`,
            });
        }
        // 🧩 Step 2: Check password
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            user.failedLoginAttempts += 1;
            // Lock if 3rd failed attempt
            if (user.failedLoginAttempts >= 3) {
                user.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // lock 30 min
                user.failedLoginAttempts = 0; // reset count after locking
                await user.save();
                loggers_1.securityLoggerInstance.error("ACCOUNT_LOCKED", { email, ip: req.ip });
                return res.status(403).json({
                    message: "Account locked for 30 minutes due to multiple failed attempts.",
                });
            }
            await user.save();
            loggers_1.securityLoggerInstance.warn("LOGIN_FAIL_INVALID_CRED", {
                email,
                attempts: user.failedLoginAttempts,
                ip: req.ip,
            });
            return res.status(400).json({ message: "Invalid credentials" });
        }
        // 🧩 Step 3: Reset lock + failed attempts on success
        user.failedLoginAttempts = 0;
        user.lockUntil = null;
        // 🧩 Step 4: Generate tokens
        const accessToken = (0, authService_1.generateAccessToken)(user);
        const refreshToken = (0, authService_1.generateRefreshToken)(user);
        user.refreshToken = refreshToken;
        await user.save();
        // 🧩 Step 5: Set cookie and respond
        res.cookie("jwt", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        loggers_1.securityLoggerInstance.info("LOGIN_SUCCESS", {
            userId: user._id,
            email,
            ip: req.ip,
        });
        res.status(200).json({
            message: "Login successful",
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (err) {
        loggers_1.securityLoggerInstance.error("LOGIN_ERROR", {
            error: err.message,
            ip: req.ip,
        });
        next(err);
    }
};
exports.login = login;
const refreshToken = async (req, res, next) => {
    try {
        const cookies = req.cookies;
        if (!cookies?.jwt) {
            loggers_1.securityLoggerInstance.warn("TOKEN_REFRESH_FAIL_NO_COOKIE", {
                ip: req.ip,
            });
            return res.status(401).json({ message: "No refresh token found" });
        }
        const refreshToken = cookies.jwt;
        // Find user with this refresh token
        const user = await user_1.User.findOne({ refreshToken });
        if (!user) {
            loggers_1.securityLoggerInstance.error("TOKEN_REUSE_DETECTED", {
                ip: req.ip,
                token: refreshToken,
            });
            return res.status(403).json({ message: "Token reuse detected" });
        }
        // Verify token validity
        jsonwebtoken_1.default.verify(refreshToken, config_1.config.refreshToken, async (err, decoded) => {
            if (err || user._id?.toString() !== decoded.id) {
                loggers_1.securityLoggerInstance.warn("TOKEN_REFRESH_FAIL_INVALID", {
                    userId: user._id,
                    ip: req.ip,
                });
                return res
                    .status(403)
                    .json({ message: "Invalid or expired refresh token" });
            }
            // Generate new tokens
            const newAccessToken = (0, authService_1.generateAccessToken)(user);
            const newRefreshToken = (0, authService_1.generateRefreshToken)(user);
            // Rotate: save new refresh token, delete old
            user.refreshToken = newRefreshToken;
            await user.save();
            // Send new refresh token as cookie
            res.cookie("jwt", newRefreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });
            loggers_1.securityLoggerInstance.info("TOKEN_REFRESH_SUCCESS", {
                userId: user._id,
                ip: req.ip,
            });
            return res.json({ accessToken: newAccessToken });
        });
    }
    catch (err) {
        loggers_1.securityLoggerInstance.error("TOKEN_REFRESH_ERROR", {
            error: err.message,
            ip: req.ip,
        });
        next(err);
    }
};
exports.refreshToken = refreshToken;
const logout = async (req, res, next) => {
    try {
        const cookies = req.cookies;
        if (!cookies?.jwt) {
            loggers_1.securityLoggerInstance.warn("LOGOUT_FAIL_NO_TOKEN", { ip: req.ip });
            return res.status(204).json({ message: "No active session" });
        }
        const refreshToken = cookies.jwt;
        const user = await user_1.User.findOne({ refreshToken });
        // No matching user — possible reuse or already logged out
        if (!user) {
            loggers_1.securityLoggerInstance.warn("LOGOUT_FAIL_UNKNOWN_TOKEN", { ip: req.ip });
            res.clearCookie("jwt", {
                httpOnly: true,
                sameSite: "strict",
                secure: process.env.NODE_ENV === "production",
            });
            return res.status(204).json({ message: "Session cleared" });
        }
        // Clear refresh token in DB
        user.refreshToken = null;
        await user.save();
        // Clear cookie
        res.clearCookie("jwt", {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
        });
        loggers_1.securityLoggerInstance.info("LOGOUT_SUCCESS", {
            userId: user._id,
            email: user.email,
            ip: req.ip,
        });
        res.status(200).json({ message: "Logged out successfully" });
    }
    catch (err) {
        loggers_1.securityLoggerInstance.error("LOGOUT_ERROR", {
            error: err.message,
            ip: req.ip,
        });
        next(err);
    }
};
exports.logout = logout;
