import { Request, Response } from "express";
import { comparePassword, hashPassword } from "../util/bycrypt";
import { signAccess, signRefresh, verifyRefresh } from "../util/jwt";
import { prisma } from "../config/db";
import { AuthRequest } from "../Middlewares/protect";
import { randomUUID } from "crypto";
import { User,RefreshToken } from "@prisma/client";

export const getUser = async (req: AuthRequest, res: Response): Promise<Response> => {
    if(!req.user) return res.status(401).json({ error: "Unauthorized" })
    const userid = req.user.id;
    const user = await prisma.user.findUnique({
        where: { id: userid },
    });
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    const { name, email, balance } = user;
    return res.status(200).json({ success: true, user: { name, email, balance } });
};

export const register = async (req: Request, res: Response): Promise<Response> => {
    const { name, email, password } = req.body;
    const hashedPassword = await hashPassword(password);

    const exist = await prisma.user.findUnique({
        where: { email: email },
    });

    if (exist) {
        return res.status(400).json({ error: "User already exists" });
    }

    await prisma.user.create({
        data: {
            name: name,
            email: email,
            password: hashedPassword,
        },
    });

    return res.status(201).send({ message: "You have been registered", success: true });
};

export const login = async (req: Request, res: Response): Promise<Response> => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
        where: { email: email },
    });
    if (!user) {
        return res.status(404).json({ errors: [{ msg: "User not found" }] });
    }
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ errors: [{ msg: "Invalid credentials" }] });
    }

    const jti = randomUUID();
    const userAcessToken = signAccess(user);
    const userRefreshToken = signRefresh(user.id, jti);

    await prisma.refreshToken.create({
        data: {
            jti: jti,
            userId: user.id,
        },
    });

    res.cookie("refreshToken", userRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.send({ success: true, message: "You are logged in", token: userAcessToken });
};

export const refresh = async (req: Request, res: Response): Promise<Response> => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ error: "Unauthorized" });

    const decoded = verifyRefresh(refreshToken);
    if (!decoded) return res.status(401).json({ error: "Unauthorized" });

    const { sub, jti } = decoded;
    const token = await prisma.refreshToken.findUnique({
        where: { jti },
    });
    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
        where: { id: sub },
    });
    if (!user) return res.status(401).send({ error: "Unauthorized" });

    await prisma.refreshToken.delete({
        where: { jti: jti },
    });

    const newJti = randomUUID();
    const acess = signAccess(user);
    const refresh = signRefresh(user.id, newJti);

    await prisma.refreshToken.create({
        data: {
            jti: newJti,
            userId: user.id,
        },
    });
    
    res.cookie("refreshToken", refresh, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    
    return res.send({ token: acess });
};

export const logout = async (req: Request, res: Response): Promise<Response> => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(204).send();
    }

    const decoded = verifyRefresh(refreshToken);
    if (decoded && decoded.jti) {
        // Use a try...catch block in case the token is invalid but we still want to clear the cookie
        try {
            await prisma.refreshToken.delete({
                where: { jti: decoded.jti },
            });
        } catch (error) {
            // Ignore errors, e.g., if token is not in DB, just proceed to clear cookie
        }
    }

    res.cookie("refreshToken", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        expires: new Date(0),
    });

    return res.status(200).json({ success: true, message: "Logged out successfully" });
};
