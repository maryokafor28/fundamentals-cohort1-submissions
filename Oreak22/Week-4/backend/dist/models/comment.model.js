"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectComment = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const projectCommentSchema = new mongoose_1.default.Schema({
    author: { type: String, required: true },
    content: { type: String, required: true },
    projectId: { type: String, required: true },
    createdAt: { type: Date, default: new Date().toISOString() },
});
const ProjectComment = mongoose_1.default.model("comments", projectCommentSchema);
exports.ProjectComment = ProjectComment;
