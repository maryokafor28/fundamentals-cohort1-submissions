"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserValidation = exports.loginUserValidation = exports.registerUserValidation = void 0;
const joi_1 = __importDefault(require("joi"));
//  Register User
exports.registerUserValidation = joi_1.default.object({
    name: joi_1.default.string().trim().min(2).max(50).required().messages({
        "string.empty": "Name is required",
        "string.min": "Name must be at least 2 characters long",
        "string.max": "Name cannot exceed 50 characters",
    }),
    email: joi_1.default.string()
        .trim()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
        "string.empty": "Email is required",
        "string.email": "Please provide a valid email address",
    }),
    password: joi_1.default.string().min(6).max(50).required().messages({
        "string.empty": "Password is required",
        "string.min": "Password must be at least 6 characters long",
    }),
    bio: joi_1.default.string().trim().min(10).max(200).optional().messages({
        "string.min": "Bio must be at least 10 characters long",
        "string.max": "Bio cannot exceed 200 characters",
    }),
    skills: joi_1.default.array()
        .items(joi_1.default.string().trim().lowercase())
        .max(10)
        .optional()
        .messages({
        "array.max": "You can only include up to 10 skills",
    }),
    LinkedIn: joi_1.default.string()
        .uri()
        .pattern(/^https:\/\/(www\.)?linkedin\.com\/.*$/)
        .optional()
        .messages({
        "string.pattern.base": "Please enter a valid LinkedIn profile URL",
    }),
    github: joi_1.default.string()
        .uri()
        .pattern(/^https:\/\/(www\.)?github\.com\/[A-Za-z0-9_-]+$/)
        .optional()
        .messages({
        "string.pattern.base": "Please enter a valid GitHub profile URL",
    }),
});
//  Login User
exports.loginUserValidation = joi_1.default.object({
    email: joi_1.default.string()
        .trim()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
        "string.empty": "Email is required",
        "string.email": "Please provide a valid email address",
    }),
    password: joi_1.default.string().min(6).required().messages({
        "string.empty": "Password is required",
        "string.min": "Password must be at least 6 characters long",
    }),
});
//  Update User Profile
exports.updateUserValidation = joi_1.default.object({
    name: joi_1.default.string().trim().min(2).max(50).optional(),
    bio: joi_1.default.string().trim().min(10).max(200).optional(),
    skills: joi_1.default.array().items(joi_1.default.string().trim().lowercase()).max(10).optional(),
    LinkedIn: joi_1.default.string()
        .uri()
        .pattern(/^https:\/\/(www\.)?linkedin\.com\/.*$/)
        .optional(),
    github: joi_1.default.string()
        .uri()
        .pattern(/^https:\/\/(www\.)?github\.com\/[A-Za-z0-9_-]+$/)
        .optional(),
});
