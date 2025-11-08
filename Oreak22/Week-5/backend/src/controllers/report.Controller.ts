import { Request, Response } from "express";
import { Doctor } from "../models/doctor.model";
import { Patient } from "../models/patient.model";
import Report from "../models/report.model";

//
// 🧩 Create new Report
//
export const createReportStudy = async (req: Request, res: Response) => {
  try {
    const doctorId = req.user?._id;

    const {
      patientId,
      title,
      doctorName,
      patientName,
      diagnosis,
      symptoms,
      treatment,
      notes,
    } = req.body;

    // Validate doctor & patient

    const [doctor, patient] = await Promise.all([
      Doctor.findById(doctorId),
      Patient.findById(patientId),
    ]);

    if (!doctor || !patient) {
      return res.status(404).json({ message: "Doctor or Patient not found" });
    }

    const reportStudy = new Report({
      doctor: doctorId,
      patient: patientId,
      doctorName,
      patientName,
      title,
      diagnosis,
      symptoms,
      treatment,
      notes,
    });

    await reportStudy.save();

    res.status(201).json({
      message: "Report created successfully",
      data: reportStudy,
    });
  } catch (error: any) {
    console.error("Error creating Report:", error);
    res.status(500).json({ message: error.message });
  }
};

//
// 📋 Get all report studies (optional filters)
//
export const getAllReportStudies = async (req: Request, res: Response) => {
  try {
    const { patientId } = req.query;
    const doctorId = req.user?._id;

    const filter: any = {};
    if (doctorId) filter.doctor = doctorId;
    if (patientId) filter.patient = patientId;

    const reportStudies = await Report.find(filter)
      .populate("doctor", "name email phone department")
      .populate("patient", "name email phone age gender");

    res.status(200).json(reportStudies);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

//
// 🔍 Get Report by ID
//
export const getReportStudyById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const reportStudy = await Report.findById(id)
      .populate("doctor", "name email phone department")
      .populate("patient", "name email phone age gender");

    if (!reportStudy) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.status(200).json(reportStudy);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

//
// ✏️ Update Report
//
export const updateReportStudy = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updated = await Report.findByIdAndUpdate(id, updateData, {
      new: true,
    })
      .populate("doctor", "name email phone department")
      .populate("patient", "name email phone age gender");

    if (!updated) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.status(200).json({
      message: "Report updated successfully",
      data: updated,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

//
// 🗑 Delete Report
//
export const deleteReportStudy = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deleted = await Report.findOneAndDelete({ _id: id });

    if (!deleted) {
      return res.status(404).json({ message: "Report not found" });
    }

    // Post middleware in schema will handle unlinking doctor/patient

    res.status(200).json({ message: "Report deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
