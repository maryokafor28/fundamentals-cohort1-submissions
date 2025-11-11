import { Request, Response } from "express";
import * as doctorService from "../services/doctorService";

export async function createDoctor(req: Request, res: Response) {
  try {
    const doctor = await doctorService.createDoctor(req.body);
    res.status(201).json({ success: true, data: doctor });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}

export async function getAllDoctors(req: Request, res: Response) {
  try {
    const doctors = await doctorService.getAllDoctors();
    res.status(200).json({ success: true, data: doctors });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function getDoctorById(req: Request, res: Response) {
  try {
    const doctor = await doctorService.getDoctorById(req.params.id);
    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }
    res.status(200).json({ success: true, data: doctor });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function updateDoctor(req: Request, res: Response) {
  try {
    const doctor = await doctorService.updateDoctor(req.params.id, req.body);
    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }
    res.status(200).json({ success: true, data: doctor });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}

export async function deleteDoctor(req: Request, res: Response) {
  try {
    const doctor = await doctorService.deleteDoctor(req.params.id);
    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }
    res.status(200).json({ success: true, message: "Doctor deleted" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}
