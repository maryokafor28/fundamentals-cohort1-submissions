import { Request, Response } from "express";
import { Doctor } from "../models/doctor.model";

//////////////////////////////////////////////////////////////////////////
export const getDoctors = async (req: Request, res: Response) => {
  try {
    const doctor = await Doctor.find();
    if (!doctor)
      res.status(400).send({ message: "Something is wrong", status: false });
    res.status(200).send({ message: "Found doctors", status: true, doctor });
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: "something is wrong", status: false });
  }
};

//////////////////////////////////////////////////////////////////////////

export const getProfile = async (req: Request, res: Response) => {
  const { _id } = req.params;
  try {
    const doctor = await Doctor.findById(_id).select(
      "-password -accessToken -refreshToken"
    );
    console.log(_id);
    if (!doctor)
      return res
        .status(400)
        .send({ message: "Doctor not found", status: false });
    res.send({ doctor, status: true });
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: "Server error", status: false });
  }
};
//////////////////////////////////////////////////////////////////////////
export const updateProfile = async (req: Request, res: Response) => {
  const { _id } = req.user!;
  const { id } = req.params;
  if (_id !== id)
    res.status(403).send({ message: "Unauthorized", status: false });
  try {
    const updatedDoctor = await Doctor.findByIdAndUpdate(_id, {
      ...req.body,
    }).select("-password -accessToken -refreshToken");
    console.log(updatedDoctor);
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
