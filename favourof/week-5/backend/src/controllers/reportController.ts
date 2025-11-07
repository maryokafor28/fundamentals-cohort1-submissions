import { Request, Response } from "express";
import { Report } from "../models/report";
import { User } from "../models/user";
import { Doctor } from "../models/doctor";

//  Create a new report
export const createReport = async (req: Request, res: Response) => {
  try {
    const { user, doctor, title, body } = req.body;

    // Validate user existence
    const userExists = await User.findById(user);
    if (!userExists) return res.status(404).json({ message: "User not found" });

    // If doctor is provided, validate it too
    if (doctor) {
      const doctorExists = await Doctor.findById(doctor);
      if (!doctorExists)
        return res.status(404).json({ message: "Doctor not found" });
    }

    const report = await Report.create({ user, doctor, title, body });

    return res.status(201).json({
      message: "Report created successfully",
      data: report,
    });
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

//  Get all reports (admin view or debugging)
export const getReports = async (_req: Request, res: Response) => {
  try {
    const reports = await Report.find({})
      .populate("user", "name email")
      .populate("doctor", "name email specialty")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: reports.length,
      data: reports,
    });
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

//  Get reports by user
export const getReportsByUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const userExists = await User.findById(userId);
    if (!userExists) return res.status(404).json({ message: "User not found" });

    const reports = await Report.find({ user: userId }).populate(
      "doctor",
      "name specialty"
    );

    return res.status(200).json({
      count: reports.length,
      data: reports,
    });
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

//  Update a report
export const updateReport = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, body } = req.body;

    const report = await Report.findByIdAndUpdate(
      id,
      { title, body },
      { new: true, runValidators: true }
    );

    if (!report) return res.status(404).json({ message: "Report not found" });

    return res.status(200).json({
      message: "Report updated successfully",
      data: report,
    });
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

//  Delete a report
export const deleteReport = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const report = await Report.findByIdAndDelete(id);
    if (!report) return res.status(404).json({ message: "Report not found" });

    return res.status(200).json({ message: "Report deleted successfully" });
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};
