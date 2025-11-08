"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newComment = exports.search = exports.getOneProject = exports.viewProfie = exports.getProject = exports.newProject = void 0;
const project_model_1 = require("../models/project.model");
const comment_model_1 = require("../models/comment.model");
const user_models_1 = require("../models/user.models");
const newProject = (req, res) => {
    console.log("project");
    try {
        const newProject = new project_model_1.Project({ ...req.body, userId: req.user._id });
        newProject
            .save()
            .then((response) => {
            res.status(200).send({ message: "project created", status: true });
        })
            .catch((err) => {
            res.status(400).send({ message: "Someting went Wrong", status: false });
        });
    }
    catch (err) {
        res.status(400).send({ message: "something went wrong", status: false });
    }
};
exports.newProject = newProject;
const getProject = async (req, res) => {
    let project;
    try {
        project = await project_model_1.Project.find({ userId: req.user._id });
        if (!project?.length)
            return res.status(400).send({ message: "no project found" });
        res.status(200).send({ message: "Found projects", project });
    }
    catch (err) {
        res.status(400).send({ message: "something went wrong" });
    }
};
exports.getProject = getProject;
const viewProfie = async (req, res) => {
    try {
        const user = await user_models_1.User.findOne({ userName: req.params.userName }).select([
            "-password",
            "-updatedAt",
            "-refreshToken",
            "-lockedUntil",
            "-failedLogins",
            "-createdAt",
            "-accessToken",
        ]);
        if (!user)
            return res.status(400).send({ message: "no user found" });
        const project = await project_model_1.Project.find({ userId: user?._id });
        res.status(200).send({ message: "Found", user, project });
    }
    catch (err) {
        res.status(400).send({ message: "something went wrong here" });
    }
};
exports.viewProfie = viewProfie;
const getOneProject = async (req, res) => {
    const { id } = req.params;
    try {
        const [project, comments] = await Promise.all([
            project_model_1.Project.findOne({ _id: id }),
            comment_model_1.ProjectComment.find({ projectId: id }),
        ]);
        if (!project)
            return res.status(400).send({ message: "no project found" });
        res.status(200).send({ message: "Found projects", project, comments });
    }
    catch (err) {
        res.status(400).send({ message: "something went wrong" });
    }
};
exports.getOneProject = getOneProject;
///////////////////////////////////////////////////////////////
const search = async (req, res) => {
    console.log("ww");
    try {
        const { query } = req.body;
        if (!query || typeof query !== "string") {
            return res.status(400).send({ message: "Query parameter is required" });
        }
        const baseFilter = {
            $or: [
                { name: { $regex: query, $options: "i" } },
                { userName: { $regex: query, $options: "i" } },
            ],
        };
        const users = await user_models_1.User.find(baseFilter).select([
            "-password",
            "-updatedAt",
            "-refreshToken",
            "-lockedUntil",
            "-failedLogins",
            "-createdAt",
            "-accessToken",
        ]);
        res.status(200).json({
            success: true,
            users: users,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
exports.search = search;
//////////////////////////////////////////////////
const newComment = (req, res) => {
    console.log("comment");
    try {
        const newComment = new comment_model_1.ProjectComment({ ...req.body });
        newComment
            .save()
            .then((response) => {
            res.status(200).send({
                message: "Comment created",
                status: true,
                Comment: response,
            });
        })
            .catch((err) => {
            res.status(400).send({ message: "Someting went Wrong", status: false });
        });
    }
    catch (err) {
        res.status(400).send({ message: "something went wrong", status: false });
    }
};
exports.newComment = newComment;
const getComments = (req, res) => {
    try {
        comment_model_1.ProjectComment.find({ projectId: req.params.id }).then((response) => {
            res.status(200).send({
                comments: response,
            });
        });
    }
    catch (err) {
        console.log(err);
        res.status(400).send({ message: "Someting went Wrong", status: false });
    }
};
