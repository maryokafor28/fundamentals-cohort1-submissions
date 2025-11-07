"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteComment = exports.updateComment = exports.getCommentsForProject = exports.createComment = void 0;
const comment_1 = require("../models/comment");
const project_1 = require("../models/project");
const AppError_1 = __importDefault(require("../utils/AppError"));
const loggers_1 = require("../utils/loggers");
// create comment
const createComment = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { projectId } = req.params;
        const { text } = req.body;
        if (!text)
            return next(new AppError_1.default("Comment text is required", 400));
        const project = await project_1.Project.findById(projectId);
        if (!project)
            return next(new AppError_1.default("Project not found", 404));
        const comment = await comment_1.Comment.create({
            text: text.trim(),
            author: userId,
            project: projectId,
        });
        res.status(201).json({
            status: "success",
            message: "Comment added successfully",
            data: comment,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.createComment = createComment;
// get comment for project
const getCommentsForProject = async (req, res, next) => {
    try {
        const { projectId } = req.params;
        const comments = await comment_1.Comment.find({ project: projectId })
            .populate("author", "name avatar github LinkedIn")
            .sort({ createdAt: -1 });
        res.status(200).json({
            status: "success",
            count: comments.length,
            data: comments,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.getCommentsForProject = getCommentsForProject;
// update comment
const updateComment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        const { text } = req.body;
        const comment = await comment_1.Comment.findById(id);
        if (!comment)
            return next(new AppError_1.default("Comment not found", 404));
        if (comment.author._id.toString() !== userId.toString()) {
            loggers_1.securityLoggerInstance.warn("UNAUTHORIZED_EDIT_COMMENT", {
                userId,
                ip: req.ip,
                commentId: comment.id,
            });
            return next(new AppError_1.default("You are not authorized to edit this comment", 403));
        }
        if (text)
            comment.text = text.trim();
        await comment.save();
        res.status(200).json({
            status: "success",
            message: "Comment updated successfully",
            data: comment,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.updateComment = updateComment;
// delete comment
const deleteComment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        const comment = await comment_1.Comment.findById(id);
        if (!comment)
            return next(new AppError_1.default("Comment not found", 404));
        if (comment.author._id.toString() !== userId.toString()) {
            loggers_1.securityLoggerInstance.warn("UNAUTHORIZED_DELETE_COMMENT", {
                userId,
                ip: req.ip,
                commentId: comment.id,
            });
            return next(new AppError_1.default("You are not authorized to delete this comment", 403));
        }
        await comment.deleteOne();
        res.status(200).json({
            status: "success",
            message: "Comment deleted successfully",
        });
    }
    catch (err) {
        next(err);
    }
};
exports.deleteComment = deleteComment;
