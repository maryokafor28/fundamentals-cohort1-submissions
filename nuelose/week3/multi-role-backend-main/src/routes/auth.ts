import express from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/User";
import {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import {
  sanitizeInput,
  validateRegistration,
  type RegistrationInput,
} from "../utils/validateInput";
import { requireAuth } from "../middlewares/auth";

const router = express.Router();

router.get("/me", requireAuth, (req, res) => {
  res.json({ email: req.user.email, role: req.user.role });
});

router.post("/register", async (req, res) => {
  const email= sanitizeInput(req.body.email)
  const password= sanitizeInput(req.body.password)
  const role = sanitizeInput(req.body.role || "user");

  const input: RegistrationInput = {email, password, role}

  const errors = validateRegistration(input)

    if (errors.length > 0) {
        return res.status(400).json({errors})
    }

  if (!email || !password)
    return res.status(400).json({ message: "Email and password required" });

  const existingUser = await User.findOne({ email });

  if (existingUser)
    return res.status(400).json({ message: "User already exist" });

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({ email, password: hashedPassword, role });
  await user.save();

  res.status(200).json({ message: "User registered Successfully" });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user)
    return res.status(400).json({ message: "Invalid email or password" });

  if (user.lockUntil && user.lockUntil.getTime() > Date.now()) {
    return res.status(400).json({ message: "Account locked. Try later." });
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    user.failedLoginAttempts += 1;
    if (user.failedLoginAttempts >= 3) {
      user.lockUntil = new Date(Date.now() + 30 * 60 * 1000);
      user.failedLoginAttempts = 0;
    }
    await user.save();
    return res.status(400).json({ message: "Invalid email or password" });
  }

  user.failedLoginAttempts = 0;
  user.lockUntil = null;

  const accessToken = createAccessToken(user.id);
  const refreshToken = createRefreshToken(user.id);

  user.refreshTokens.push(refreshToken);
  await user.save();

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.json({ accessToken });
});

router.post("/refresh", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken)
    return res.status(400).json({ message: "No refresh token" });

  try {
    const payload = verifyRefreshToken(refreshToken);
    const user = await User.findById(payload.id);

    if (!user || !user.refreshTokens.includes(refreshToken)) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    user.refreshTokens = user.refreshTokens.filter((t) => t !== refreshToken);
    const newAccessToken = createAccessToken(user.id);
    const newRefreshToken = createRefreshToken(user.id);

    user.refreshTokens.push(newRefreshToken);

    await user.save();

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken: newAccessToken });
  } catch {
    res.status(400).json({ message: "Invalid refresh token" });
  }
});

router.post("/logout", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken)
    return res.status(400).json({ message: "No refresh token" });

  try {
    const payload = verifyRefreshToken(refreshToken);
    const user = await User.findById(payload.id);

    if (user) {
      user.refreshTokens = user.refreshTokens.filter((t) => t !== refreshToken);
      await user.save();
    }
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });
  } catch (e) {
    res.status(400).json({ message: "Invalid token" });
  }
});

export default router;
