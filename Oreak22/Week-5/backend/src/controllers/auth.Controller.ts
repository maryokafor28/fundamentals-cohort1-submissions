import { Request, Response } from "express";
const jwt = require("jsonwebtoken");
import dotenv from "dotenv";
import { generateAccessToken, generateRefreshToken } from "../config/jwt";
// import { Doctor, verifyPassword } from "../models/user.models";
import bcryptjs from "bcryptjs";
import { validationResult } from "express-validator";
import { Doctor, verifyPassword } from "../models/doctor.model";

dotenv.config();

////////////////////////////////////////////////////////////////////////
export const register = async (req: Request, res: Response) => {
  console.log(req.body);
  const { email } = req.body;
  const existing = await Doctor.findOne({ email: email });
  if (existing)
    return res.status(400).send({ message: "Doctor already exists" });

  const newDoctor = new Doctor(req.body);

  newDoctor
    .save()
    .then((user) => {
      res.status(201).send({
        message: "Doctor created",
        user: { id: user._id, email: user.email },
        status: true,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send({
        message: "Troble creating new user",
        err,
        status: false,
      });
    });
};

/////////////////////////////////////////////////////////////////////////
export const login = async (req: Request, res: Response) => {
  console.log(req.body);
  const { email, password } = req.body;
  const doctor = await Doctor.findOne({ email });
  if (!doctor)
    return res.status(404).send({ message: "Doctor not found", status: false });
  const isValid = await verifyPassword(password, doctor.password);
  if (!isValid) {
    return res.status(400).send({
      message: `Invalid credentials, your account have been lock for 30 minite`,
      status: false,
    });
  }

  const [accessToken, refreshToken] = await Promise.all([
    generateAccessToken({
      _id: doctor._id.toString(),
      name: doctor.name,
      email: doctor.email,
    }),
    generateRefreshToken({
      _id: doctor._id.toString(),
      name: doctor.name,
      email: doctor.email,
    }),
  ]);
  const [hashAccessToken, hashRefreshToken] = await Promise.all([
    bcryptjs.hash(accessToken, Number(process.env.BCRYPT_SALT)),
    bcryptjs.hash(refreshToken, Number(process.env.BCRYPT_SALT)),
  ]);

  await Doctor.findByIdAndUpdate(doctor._id, {
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
    doctor: { id: doctor._id, email: doctor.email, name: doctor.name },
    status: true,
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
    const doctor = await Doctor.findById(decoded._id);
    if (!doctor) return res.status(400).send({ message: "Doctor not found" });
    if (!doctor?.refreshToken)
      return res.status(400).send({ message: "Token not found" });
    const confirmToken = await bcryptjs.compare(token, doctor?.refreshToken);
    if (!confirmToken)
      return res
        .status(401)
        .send({ message: "Invalid or expired refresh token" });
    const [accessToken, refreshToken] = await Promise.all([
      generateAccessToken({
        _id: doctor._id.toString(),
        name: doctor.name,
        email: doctor.email,
      }),
      generateRefreshToken({
        _id: doctor._id.toString(),
        name: doctor.name,
        email: doctor.email,
      }),
    ]);
    //
    const [hashAccessToken, hashRefreshToken] = await Promise.all([
      bcryptjs.hash(accessToken, Number(process.env.BCRYPT_SALT)),
      bcryptjs.hash(refreshToken, Number(process.env.BCRYPT_SALT)),
    ]);
    await Doctor.findByIdAndUpdate(doctor._id, {
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
      doctor: {
        id: doctor._id,
        email: doctor.email,
        name: doctor.name,
      },
    });
  } catch (err) {
    return res
      .status(403)
      .send({ message: "Invalid or expired refresh token" });
  }
};

// //////////////////////////////////////////////////////////////////
export const logout = async (req: Request, res: Response) => {
  // const { _id } = req.user;
  try {
    await Doctor.findByIdAndUpdate(req.user?._id, {
      accessToken: null,
      refreshToken: null,
    });
    res.clearCookie("refreshToken");
    res.send({ message: "Logged out successfully" });
  } catch (err) {
    console.log(err);
  }
};

//////////////////////////////////////////////////////////////////////////
export const getProfile = async (req: Request, res: Response) => {
  const { _id } = req.user!;
  try {
    const doctor = await Doctor.findById(_id).select(
      "-password -accessToken -refreshToken"
    );
    if (!doctor)
      return res
        .status(404)
        .send({ message: "Doctor not found", status: false });
    res.send({ doctor, status: true });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Server error", status: false });
  }
};
//////////////////////////////////////////////////////////////////////////
export const updateProfile = async (req: Request, res: Response) => {
  const { _id } = req.user!;
  try {
    const updatedDoctor = await Doctor.findByIdAndUpdate(_id, req.body, {
      new: true,
    }).select("-password -accessToken -refreshToken");
    if (!updatedDoctor)
      return res
        .status(404)
        .send({ message: "Doctor not found", status: false });
    res.send({ doctor: updatedDoctor, status: true });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Server error", status: false });
  }
};
//////////////////////////////////////////////////////////////////////////
export const changePassword = async (req: Request, res: Response) => {
  const { _id } = req.user!;
  const { oldPassword, newPassword } = req.body;
  try {
    const doctor = await Doctor.findById(_id).select("+password");
    if (!doctor)
      return res
        .status(404)
        .send({ message: "Doctor not found", status: false });
    const isValid = await verifyPassword(oldPassword, doctor.password);
    if (!isValid) {
      return res
        .status(400)
        .send({ message: "Old password is incorrect", status: false });
    }
    doctor.password = newPassword;
    await doctor.save();
    res.send({ message: "Password changed successfully", status: true });
  } catch {}
};
