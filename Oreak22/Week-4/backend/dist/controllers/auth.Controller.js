"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.refreshToken = exports.login = exports.register = void 0;
const jwt = require("jsonwebtoken");
const dotenv_1 = __importDefault(require("dotenv"));
const jwt_1 = require("../config/jwt");
const user_models_1 = require("../models/user.models");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
dotenv_1.default.config();
////////////////////////////////////////////////////////////////////////
const register = async (req, res) => {
    console.log("hdbj");
    const { name, email, password, role, userName } = req.body;
    const existing = await user_models_1.User.findOne({ email: email });
    if (existing)
        return res.status(400).send({ message: "User already exists" });
    //   const user = await createUser(email, password);
    const newUser = new user_models_1.User({ name, email, password, role, userName });
    newUser
        .save()
        .then((user) => {
        res.status(201).send({
            message: "User created",
            user: { id: user.id, email: user.email, role: user.role },
        });
    })
        .catch((err) => {
        res.status(400).send({
            message: "Troble creating new user",
            err,
        });
    });
};
exports.register = register;
/////////////////////////////////////////////////////////////////////////
const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await user_models_1.User.findOne({ email });
    if (!user)
        return res.status(404).send({ message: "User not found" });
    if (user.lockedUntil && user.lockedUntil > new Date())
        return res
            .status(404)
            .send({ message: "Your account is locked, try again in 30 min" });
    const isValid = await (0, user_models_1.verifyPassword)(password, user.password);
    if (!isValid) {
        if (user.failedLogins == 2) {
            await user_models_1.User.findByIdAndUpdate(user._id, {
                lockedUntil: new Date(Date.now() + (Number(process.env.LOCKED_UNTIL) || 3 * 60 * 1000)),
            })
                .then((updatedUser) => res.status(400).send({
                message: `Invalid credentials, your account have been lock for 30 minite`,
            }))
                .catch((err) => {
                res.status(400).send({ message: "something is wrong" });
            });
            return;
        }
        user_models_1.User.findByIdAndUpdate(user._id, {
            failedLogins: user.failedLogins ? user.failedLogins + 1 : 1,
        })
            .then((updatedUser) => res.status(400).send({
            message: `Invalid credentials, you have ${3 - (updatedUser?.failedLogins ? updatedUser?.failedLogins : 1)} left`,
        }))
            .catch((err) => {
            res.status(400).send({ message: "something is wrong1" });
        });
        return;
    }
    // const accessToken = generateAccessToken(user);
    // const refreshToken = ;
    const [accessToken, refreshToken] = await Promise.all([
        (0, jwt_1.generateAccessToken)({
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            userName: user.userName,
        }),
        (0, jwt_1.generateRefreshToken)({
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            userName: user.userName,
        }),
    ]);
    const [hashAccessToken, hashRefreshToken] = await Promise.all([
        bcryptjs_1.default.hash(accessToken, Number(process.env.BCRYPT_SALT)),
        bcryptjs_1.default.hash(refreshToken, Number(process.env.BCRYPT_SALT)),
    ]);
    await user_models_1.User.findByIdAndUpdate(user._id, {
        failedLogins: 0,
        lockedUntil: null,
        accessToken: hashAccessToken,
        refreshToken: hashRefreshToken,
    });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.send({
        accessToken,
        user: {
            id: user._id,
            email: user.email,
            role: user.role,
            name: user.name,
            userName: user.userName,
        },
    });
};
exports.login = login;
////////////////////////////////////////////////////////////////////////
const refreshToken = async (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token)
        return res.status(401).send({ message: "No refresh token" });
    try {
        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        const user = await user_models_1.User.findById(decoded._id);
        if (!user)
            return res.status(400).send({ message: "User not found" });
        if (!user?.refreshToken)
            return res.status(400).send({ message: "Token not found" });
        const confirmToken = await bcryptjs_1.default.compare(token, user?.refreshToken);
        if (!confirmToken)
            return res
                .status(401)
                .send({ message: "Invalid or expired refresh token" });
        const [accessToken, refreshToken] = await Promise.all([
            (0, jwt_1.generateAccessToken)({
                _id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role,
                userName: user.userName,
            }),
            (0, jwt_1.generateRefreshToken)({
                _id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role,
                userName: user.userName,
            }),
        ]);
        //
        const [hashAccessToken, hashRefreshToken] = await Promise.all([
            bcryptjs_1.default.hash(accessToken, Number(process.env.BCRYPT_SALT)),
            bcryptjs_1.default.hash(refreshToken, Number(process.env.BCRYPT_SALT)),
        ]);
        await user_models_1.User.findByIdAndUpdate(user._id, {
            accessToken: hashAccessToken,
            refreshToken: hashRefreshToken,
        });
        //
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.send({
            accessToken: accessToken,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                name: user.name,
                userName: user.userName,
            },
        });
    }
    catch (err) {
        return res
            .status(403)
            .send({ message: "Invalid or expired refresh token" });
    }
};
exports.refreshToken = refreshToken;
//////////////////////////////////////////////////////////////////
const logout = async (req, res) => {
    const { _id } = req.user;
    console.log("eworks");
    try {
        await user_models_1.User.findByIdAndUpdate(_id, {
            accessToken: null,
            refreshToken: null,
        });
        res.clearCookie("refreshToken");
        res.send({ message: "Logged out successfully" });
    }
    catch (err) {
        console.log(err);
    }
};
exports.logout = logout;
