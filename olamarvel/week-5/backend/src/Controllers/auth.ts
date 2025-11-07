import { Request, Response } from "express";
import User from "../Models/User";
import { validationResult } from "express-validator";
import { comparePassword, hashPassword } from "../util/bycrypt";
import { randomUUID } from "crypto";
import { signAccess, signRefresh, verifyAccess, verifyRefresh } from "../util/jwt";
import { AuthRequest } from "../Middlewares/protect";

export const getUser = async (req: AuthRequest, res: Response): Promise<Response> => {
    const userid = req.user.id
    const user = await User.findById(userid);
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    const { name, email, age, activities, meals, appointments, reports, } = user.toObject();
    return res.status(200).json({ success: true, user: { name, email, age, activities, meals, appointments, reports } });
}

export const register = async (req: Request, res: Response): Promise<Response> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password, age } = req.body
    const hashedPassword = await hashPassword(password)
    const exist = await User.findOne({ email })
    if (exist) return res.status(400).json({ error: "User already exist" })
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        age
    })
    await user.save()

    return res.status(201).send({ message: "You have been registered", success: true })
}

export const login = async (req: Request, res: Response): Promise<Response> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) {
        return res.status(404).json({ errors: [{ msg: "User not found" }] });
    }
    const isMatch = await comparePassword(password, user.password)
    if (!isMatch) {
        return res.status(401).json({ errors: [{ msg: "Invalid credentials" }] });
    }

    const jti = randomUUID();
    const userAcessToken = signAccess(user)
    const userRefreshToken = signRefresh(user._id, jti)
    user.refreshTokens.push({ jti, token: userRefreshToken })
    await user.save()

    res.cookie("refreshToken", userRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.send({ success: true, message: "You are logged in", token: userAcessToken })
}

export const refresh = async (req: Request, res: Response): Promise<Response> => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ error: "Unauthorized" })
    const decoded = verifyRefresh(refreshToken)
    if (!decoded) return res.status(401).json({ error: "Unauthorized" })

    const { sub, jti } = decoded
    const user = await User.findById(sub)
    if (!user) return res.status(401).send({ error: "Unauthorized" })
    const token = user.refreshTokens.find(token => token.jti === jti)
    if (!token) {
        user.refreshTokens = []
        res.cookie("refreshToken", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            expires: new Date(0)
        });
        await user.save()
        return res.status(401).send({ error: "Unauthorized" })
    }

    const njti = randomUUID();
    const acess = signAccess(user)
    user.refreshTokens = user.refreshTokens.filter(
        (token) => token.jti !== decoded.jti
    );
    const refresh = signRefresh(user._id, njti)
    user.refreshTokens.push({ jti: njti, token: refresh })
    await user.save()
    res.cookie("refreshToken", refresh, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
    return res.send({ token: acess })
};

export const logout = async (req: Request, res: Response): Promise<Response> => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(204).send();
    }

    res.cookie("refreshToken", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        expires: new Date(0)
    });

    const decoded = verifyRefresh(refreshToken);

    if (decoded && decoded.jti) {
        const user = await User.findById(decoded.sub);
        if (user) {
            user.refreshTokens = user.refreshTokens.filter(
                (token) => token.jti !== decoded.jti
            );
            await user.save();
        }
    }

    return res.status(200).json({ success: true, message: "Logged out successfully" });
}