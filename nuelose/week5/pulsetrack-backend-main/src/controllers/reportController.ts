import { Request, Response } from "express";
import { Report, User } from "../models/index.js";

export const createReport = async (req: Request, res: Response) => {
  try {
    const { email, type, summary, reportDate } = req.body;

    const existingUser = await User.findOne({email});
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const newReport = await Report.create({
      user:existingUser._id,
      type,
      summary,
      reportDate,
    });

    existingUser.reports.push(newReport.id);
    await existingUser.save();

    const populateReport = await newReport.populate("user");
    res.status(201).json(populateReport);
  } catch (error) {
    res.status(400).json({ message: "Error creating report", error });
  }
};

export const getReports = async (_req: Request, res: Response) => {
  try {
    const reports = await Report.find().populate("user", "name");
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reports", error });
  }
};

export const getReportById = async (req: Request, res: Response) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: "Report not found" });
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: "Error fetching report", error });
  }
};

export const updateReport = async (req: Request, res: Response) => {
  try {
    const report = await Report.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!report) return res.status(404).json({ message: "Report not found" });
    res.json(report);
  } catch (error) {
    res.status(400).json({ message: "Error updating report", error });
  }
};

export const deleteReport = async (req: Request, res: Response) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);
    if (!report) return res.status(404).json({ message: "Report not found" });
    res.json({ message: "Report deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting report", error });
  }
};
