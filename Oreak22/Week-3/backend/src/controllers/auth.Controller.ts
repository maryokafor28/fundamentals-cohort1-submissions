import { Request, Response } from "express";
const jwt = require("jsonwebtoken");
import dotenv from "dotenv";
import { generateAccessToken, generateRefreshToken } from "../config/jwt";
import { User, verifyPassword } from "../models/user.models";
import bcryptjs from "bcryptjs";
import { validationResult } from "express-validator";

dotenv.config();

////////////////////////////////////////////////////////////////////////
export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const existing = await User.findOne({ email: email });
  if (existing) return res.status(400).send({ message: "User already exists" });

  //   const user = await createUser(email, password);
  const newUser = new User({ name, email, password });

  newUser
    .save()
    .then((user) => {
      res.status(201).send({
        message: "User created",
        user: { id: user.id, email: user.email },
      });
    })
    .catch((err) => {
      res.status(400).send({
        message: "Troble creating new user",
        err,
      });
    });
};

/////////////////////////////////////////////////////////////////////////
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).send({ message: "User not found" });
  if (user.lockedUntil && user.lockedUntil > new Date())
    return res
      .status(404)
      .send({ message: "Your account is locked, try again in 30 min" });

  const isValid = await verifyPassword(password, user.password);
  if (!isValid) {
    if (user.failedLogins == 2) {
      await User.findByIdAndUpdate(user._id, {
        lockedUntil: new Date(
          Date.now() + (Number(process.env.LOCKED_UNTIL) || 3 * 60 * 1000)
        ),
      })
        .then((updatedUser) =>
          res.status(400).send({
            message: `Invalid credentials, your account have been lock for 30 minite`,
          })
        )
        .catch((err) => {
          res.status(400).send({ message: "something is wrong" });
        });
      return;
    }

    User.findByIdAndUpdate(user._id, {
      failedLogins: user.failedLogins ? user.failedLogins + 1 : 1,
    })
      .then((updatedUser) =>
        res.status(400).send({
          message: `Invalid credentials, you have ${
            3 - (updatedUser?.failedLogins ? updatedUser?.failedLogins : 1)
          } left`,
        })
      )
      .catch((err) => {
        res.status(400).send({ message: "something is wrong1" });
      });
    return;
  }

  // const accessToken = generateAccessToken(user);
  // const refreshToken = ;
  const [accessToken, refreshToken] = await Promise.all([
    generateAccessToken({
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    }),
    generateRefreshToken({
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    }),
  ]);
  const [hashAccessToken, hashRefreshToken] = await Promise.all([
    bcryptjs.hash(accessToken, Number(process.env.BCRYPT_SALT)),
    bcryptjs.hash(refreshToken, Number(process.env.BCRYPT_SALT)),
  ]);

  await User.findByIdAndUpdate(user._id, {
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
    user: { id: user._id, email: user.email, role: user.role, name: user.name },
  });
};

////////////////////////////////////////////////////////////////////////

export const refreshToken = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).send({ message: "No refresh token" });
  try {
    const decoded = jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET as string
    ) as any;
    const user = await User.findById(decoded._id);
    if (!user) return res.status(400).send({ message: "User not found" });
    if (!user?.refreshToken)
      return res.status(400).send({ message: "Token not found" });
    const confirmToken = await bcryptjs.compare(token, user?.refreshToken);

    if (!confirmToken)
      return res
        .status(401)
        .send({ message: "Invalid or expired refresh token" });

    const [accessToken, refreshToken] = await Promise.all([
      generateAccessToken({
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      }),
      generateRefreshToken({
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      }),
    ]);
    //
    const [hashAccessToken, hashRefreshToken] = await Promise.all([
      bcryptjs.hash(accessToken, Number(process.env.BCRYPT_SALT)),
      bcryptjs.hash(refreshToken, Number(process.env.BCRYPT_SALT)),
    ]);

    await User.findByIdAndUpdate(user._id, {
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
      },
    });
  } catch (err) {
    return res
      .status(403)
      .send({ message: "Invalid or expired refresh token" });
  }
};

//////////////////////////////////////////////////////////////////
export const logout = async (req: Request, res: Response) => {
  const { _id } = req.user;
  console.log("eworks");
  try {
    await User.findByIdAndUpdate(_id, {
      accessToken: null,
      refreshToken: null,
    });
    res.clearCookie("refreshToken");
    res.send({ message: "Logged out successfully" });
  } catch (err) {
    console.log(err);
  }
};
