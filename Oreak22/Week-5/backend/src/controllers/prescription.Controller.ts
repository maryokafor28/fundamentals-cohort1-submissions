import { Request, Response } from "express";
import { Doctor } from "../models/doctor.model";
import { Patient } from "../models/patient.model";
import Report from "../models/report.model";
import Prescription from "../models/prescription.model";

//
// 💊 Create a new prescription
//
export const createPrescription = async (req: Request, res: Response) => {
  try {
    const doctorId = req.user?._id;

    const { patientId, reportId, medicines, instructions } = req.body;

    // Validate doctor & patient existence
    const doctor = await Doctor.findById(doctorId);
    const patient = await Patient.findById(patientId);
    const report = reportId ? await Report.findById(reportId) : null;

    if (!doctor || !patient) {
      return res.status(404).json({ message: "Doctor or Patient not found" });
    }

    const prescription = new Prescription({
      doctor: doctorId,
      patient: patientId,
      report: reportId || null,
      medicines,
      instructions,
    });

    await prescription.save();

    res.status(201).json({
      message: "Prescription created successfully",
      data: prescription,
    });
  } catch (error: any) {
    console.error("Error creating prescription:", error);
    res.status(500).json({ message: error.message });
  }
};

//
// 📋 Get all prescriptions (with optional filters)
//
export const getAllPrescriptions = async (req: Request, res: Response) => {
  try {
    const doctorId = req.user?._id;

    const { patientId, reportId } = req.query;

    const filter: any = {};
    if (doctorId) filter.doctor = doctorId;
    if (patientId) filter.patient = patientId;
    if (reportId) filter.report = reportId;

    const prescriptions = await Prescription.find(filter)
      .populate("doctor", "name email phone department")
      .populate("patient", "name email phone age gender")
      .populate("report", "title diagnosis");

    res.status(200).json(prescriptions);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

//
// 🔍 Get prescription by ID
//
export const getPrescriptionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const prescription = await Prescription.findById(id)
      .populate("doctor", "name email phone department")
      .populate("patient", "name email phone age gender")
      .populate("report", "title diagnosis");

    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    res.status(200).json(prescription);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

//
// ✏️ Update prescription
//
export const updatePrescription = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updated = await Prescription.findByIdAndUpdate(id, updateData, {
      new: true,
    })
      .populate("doctor", "name email phone department")
      .populate("patient", "name email phone age gender")
      .populate("report", "title diagnosis");

    if (!updated) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    res.status(200).json({
      message: "Prescription updated successfully",
      data: updated,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

//
// 🗑 Delete prescription
//
export const deletePrescription = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deleted = await Prescription.findOneAndDelete({ _id: id });

    if (!deleted) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    // Auto-unlink handled by middleware in schema

    res.status(200).json({ message: "Prescription deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
