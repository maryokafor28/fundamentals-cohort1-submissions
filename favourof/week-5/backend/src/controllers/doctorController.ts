import { Request, Response } from "express";
import { Doctor } from "../models/doctor";

//  Create a new doctor
export const createDoctor = async (req: Request, res: Response) => {
  try {
    const { name, email, specialty } = req.body;

    const existing = await Doctor.findOne({ email });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Doctor with this email already exists" });
    }

    const doctor = await Doctor.create({ name, email, specialty });
    return res
      .status(201)
      .json({ message: "Doctor created successfully", data: doctor });
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

//  Get all doctors
export const getDoctors = async (_req: Request, res: Response) => {
  try {
    const doctors = await Doctor.find({ isActive: true }).sort({
      createdAt: -1,
    });
    return res.status(200).json({ count: doctors.length, data: doctors });
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

//  Get doctor by ID
export const getDoctorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findById(id);

    if (!doctor || !doctor.isActive) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    return res.status(200).json({ data: doctor });
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

//  Update doctor
export const updateDoctor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, specialty, isActive } = req.body;

    const doctor = await Doctor.findByIdAndUpdate(
      id,
      { name, email, specialty, isActive },
      { new: true, runValidators: true }
    );

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    return res
      .status(200)
      .json({ message: "Doctor updated successfully", data: doctor });
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

//  Soft delete doctor
export const deleteDoctor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findById(id);

    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    doctor.isActive = false;
    await doctor.save();

    return res.status(200).json({ message: "Doctor deactivated successfully" });
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};
