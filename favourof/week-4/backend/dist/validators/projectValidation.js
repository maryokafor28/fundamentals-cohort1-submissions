"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProjectValidation = exports.createProjectValidation = void 0;
const joi_1 = __importDefault(require("joi"));
//  create project
exports.createProjectValidation = joi_1.default.object({
    title: joi_1.default.string().trim().min(3).max(100).required().messages({
        "string.empty": "Project title is required",
        "string.min": "Project title must be at least 3 characters long",
        "string.max": "Project title cannot exceed 100 characters",
    }),
    description: joi_1.default.string().trim().min(10).max(2000).required().messages({
        "string.empty": "Project description is required",
        "string.min": "Description must be at least 10 characters long",
        "string.max": "Description cannot exceed 2000 characters",
    }),
    tag: joi_1.default.array()
        .items(joi_1.default.string()
        .trim()
        .pattern(/^[a-zA-Z0-9-]+$/)
        .message("Tags must contain only letters, numbers, or hyphens"))
        .max(10)
        .messages({
        "array.max": "You can only add up to 10 tags",
    }),
});
// update project/
exports.updateProjectValidation = joi_1.default.object({
    title: joi_1.default.string().trim().min(3).max(100).optional().messages({
        "string.min": "Project title must be at least 3 characters long",
        "string.max": "Project title cannot exceed 100 characters",
    }),
    description: joi_1.default.string().trim().min(10).max(2000).optional().messages({
        "string.min": "Description must be at least 10 characters long",
        "string.max": "Description cannot exceed 2000 characters",
    }),
    tag: joi_1.default.array()
        .items(joi_1.default.string()
        .trim()
        .pattern(/^[a-zA-Z0-9-]+$/)
        .message("Tags must contain only letters, numbers, or hyphens"))
        .max(10)
        .optional()
        .messages({
        "array.max": "You can only add up to 10 tags",
    }),
});
