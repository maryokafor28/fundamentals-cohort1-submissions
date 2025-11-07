"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleLikeProject = exports.deleteProject = exports.updateProject = exports.getProjectById = exports.getAllProjects = exports.createProject = void 0;
const project_1 = require("../models/project");
const AppError_1 = __importDefault(require("../utils/AppError"));
const loggers_1 = require("../utils/loggers");
//  Create Project
const createProject = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { title, description, tag } = req.body;
        if (!title || !description) {
            return next(new AppError_1.default("Title and description are required", 400));
        }
        const newProject = await project_1.Project.create({
            title: title.trim(),
            description: description.trim(),
            author: userId,
            tag: Array.isArray(tag) ? tag.map((t) => t.toLowerCase()) : [],
        });
        res.status(201).json({
            status: "success",
            message: "Project created successfully",
            data: newProject,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.createProject = createProject;
//  Get All Projects
const getAllProjects = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const [projects, total] = await Promise.all([
            project_1.Project.find()
                .populate("author", "name email avatar")
                .populate("comments")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            project_1.Project.countDocuments(),
        ]);
        res.status(200).json({
            status: "success",
            count: projects.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            data: projects,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.getAllProjects = getAllProjects;
//  Get Single Project
const getProjectById = async (req, res, next) => {
    try {
        const project = await project_1.Project.findById(req.params.id).populate("author", "name avatar skills github LinkedIn");
        if (!project)
            return next(new AppError_1.default("Project not found", 404));
        res.status(200).json({ status: "success", data: project });
    }
    catch (err) {
        next(err);
    }
};
exports.getProjectById = getProjectById;
//  Update Project (only author)
const updateProject = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        const project = await project_1.Project.findById(id);
        if (!project)
            return next(new AppError_1.default("Project not found", 404));
        if (project.author._id.toString() !== userId.toString()) {
            loggers_1.securityLoggerInstance.warn("UNAUTHORIZED_EDIT_PROJECT", {
                userId,
                ip: req.ip,
                project: project.id,
            });
            return next(new AppError_1.default("You are not authorized to edit this project", 403));
        }
        const { title, description, tag } = req.body;
        if (title)
            project.title = title.trim();
        if (description)
            project.description = description.trim();
        if (tag && Array.isArray(tag))
            project.tag = tag.map((t) => t.toLowerCase());
        await project.save();
        res.status(200).json({
            status: "success",
            message: "Project updated successfully",
            data: project,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.updateProject = updateProject;
//  Delete Project
const deleteProject = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        console.log(userId, "this is the user id");
        const project = await project_1.Project.findById(id);
        if (!project)
            return next(new AppError_1.default("Project not found", 404));
        if (project.author._id.toString() !== userId.toString()) {
            loggers_1.securityLoggerInstance.warn("UNAUTHORIZED_DELETE_PROJECT", {
                userId,
                ip: req.ip,
                project: project.id,
            });
            return next(new AppError_1.default("You are not authorized to delete this project", 403));
        }
        await project.deleteOne();
        res
            .status(200)
            .json({ status: "success", message: "Project deleted successfully" });
    }
    catch (err) {
        next(err);
    }
};
exports.deleteProject = deleteProject;
// Like / Unlike Project
const toggleLikeProject = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        const project = await project_1.Project.findById(id);
        if (!project)
            return next(new AppError_1.default("Project not found", 404));
        const alreadyLiked = project.likes.includes(userId);
        if (alreadyLiked) {
            project.likes = project.likes.filter((u) => u.toString() !== userId.toString());
        }
        else {
            project.likes.push(userId);
        }
        await project.save();
        res.status(200).json({
            status: "success",
            message: alreadyLiked ? "Project unliked" : "Project liked",
            data: project,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.toggleLikeProject = toggleLikeProject;
