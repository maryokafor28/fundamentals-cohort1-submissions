import { Request, Response } from "express";
import bcrypt from "bcrypt";
import {User} from "../models";
import { validateEmail, validatePassword } from "../utils/sanitizer";
import { hash as hashPassword } from "../utils/password";
import { signAccess, signRefresh, verifyRefresh } from "../utils/jwt";
import { generateId } from "../utils/helpers";
 

export async function register(req: Request, res: Response) {
  try {
    const { email, password, username,} = req.body;

    if (!validateEmail(email) || !validatePassword(password)) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) return res.status(409).json({ message: "User mail or username already exists" });

    const passwordHash = await hashPassword(password);
    const user = new User({
      email,
      passwordHash,
      role: "user",
      failedLogins: 0,
      lockedUntil: null,
      refreshTokens: [],
      username,
    });

    await user.save();

    const accessToken = signAccess(user);
    const jti = generateId();
    const refreshToken = signRefresh(user._id, jti);
    await User.findByIdAndUpdate(
      user._id,
      { $push: { refreshTokens: {
        tokenId: jti, // Store tokenId instead of the full token
        token: refreshToken, // Store the token itself
        expiresAt: new Date(Date.now() + 7*24*60*60*1000), // e.g. 7 days
        revoked: false,
      } } },
      { new: true }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(201).json({ accessToken, id: user._id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password, username } = req.body;
    const user = await User.findOne({ $or: [{ email }, { username }] });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      return res.status(403).json({ message: "Account locked. Try later." });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      user.failedLogins = (user.failedLogins || 0) + 1;
      if (user.failedLogins >= 3) {
        user.lockedUntil = new Date(Date.now() + 30 * 60 * 1000);
        user.failedLogins = 0;
      }
      await user.save();
      return res.status(401).json({ message: "Invalid credentials" });
    }

    user.failedLogins = 0;
    user.lockedUntil = null;

    const accessToken = signAccess(user);
    const jti = generateId();
    const refreshToken = signRefresh(user._id, jti);
    await User.findByIdAndUpdate(
      user._id,
      { $push: { refreshTokens: {
        tokenId: jti,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7*24*60*60*1000), // e.g. 7 days
        revoked: false,
      } } },
      { new: true }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.json({ accessToken,id:user._id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}


export async function refresh(req: Request, res: Response) {
  try {
    
    const cookieToken = (req as any).cookies?.refreshToken;
    const bearer = req.headers["authorization"] as string | undefined;
    const headerToken = bearer?.startsWith("Bearer ") ? bearer.split(" ")[1] : undefined;
    const token = cookieToken || headerToken;

    if (!token) return res.status(401).json({ message: "No refresh token provided" });

    const payload = verifyRefresh(token);
    if (!payload) return res.status(401).json({ message: "Invalid refresh token" });

    const user = await User.findById(payload.sub);
    if (!user) return res.status(401).json({ message: "User not found" });

    
    const tokenRecord = user.refreshTokens.find((t: any) => t.tokenId === payload.jti && !t.revoked);
    if (!tokenRecord) {
      return res.status(401).json({ message: "Refresh token revoked or not recognized" });
    }

    tokenRecord.revoked = true;

    
    const newJti = generateId();
    const newRefreshToken = signRefresh(user._id, newJti);
    user.refreshTokens.push({ tokenId: newJti, createdAt: new Date(), revoked: false });

    await user.save();

    const newAccessToken = signAccess(user);
//08022225225
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.json({ accessToken: newAccessToken });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function logout(req: Request, res: Response) {
  try {
    const cookieToken = (req as any).cookies?.refreshToken;
    const bearer = req.headers["authorization"] as string | undefined;
    const headerToken = bearer?.startsWith("Bearer ") ? bearer.split(" ")[1] : undefined;
    const token = cookieToken || headerToken;

    if (!token) {
      res.clearCookie("refreshToken");
      return res.status(200).json({ message: "Logged out" });
    }

    const payload = verifyRefresh(token);
    if (!payload) {
      res.clearCookie("refreshToken");
      return res.status(200).json({ message: "Logged out" });
    }

    const user = await User.findById(payload.sub);
    if (!user) {
      res.clearCookie("refreshToken");
      return res.status(200).json({ message: "Logged out" });
    }

    user.refreshTokens.forEach((t: any) => {
      if (t.tokenId === payload.jti) t.revoked = true;
    });
    await user.save();

    res.clearCookie("refreshToken");
    return res.status(200).json({ message: "Logged out" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function logoutAll(req: Request, res: Response) {
  try {
    // require authentication upstream (use authMiddleware)
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthenticated" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.refreshTokens.forEach((t: any) => {
      t.revoked = true;
    });
    await user.save();

    res.clearCookie("refreshToken");
    return res.status(200).json({ message: "Logged out from all sessions" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}