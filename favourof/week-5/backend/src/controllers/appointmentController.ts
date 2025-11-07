import { Request, Response } from "express";
import { Appointment } from "../models/appointment";
import { Doctor } from "../models/doctor";
import { User } from "../models/user";

// ✅ Create new appointment
export const createAppointment = async (req: Request, res: Response) => {
  try {
    const { user, doctor, patients, appointmentDate, notes } = req.body;

    // Validate doctor and user existence
    const [doctorExists, userExists] = await Promise.all([
      Doctor.findById(doctor),
      User.findById(user),
    ]);

    if (!doctorExists) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create appointment
    const appointment = await Appointment.create({
      user,
      doctor,
      patients,
      appointmentDate,
      notes,
    });

    // Update doctor's total appointments
    await Doctor.findByIdAndUpdate(doctor, { $inc: { totalAppointments: 1 } });

    return res.status(201).json({
      message: "Appointment created successfully",
      data: appointment,
    });
  } catch (err: any) {
    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

// ✅ Get all appointments
export const getAppointments = async (_req: Request, res: Response) => {
  try {
    const appointments = await Appointment.find({ isDeleted: false })
      .populate("user", "name email")
      .populate("doctor", "name email specialty")
      .sort({ appointmentDate: -1 });

    return res.status(200).json({
      count: appointments.length,
      data: appointments,
    });
  } catch (err: any) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Get appointment by ID
export const getAppointmentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id)
      .populate("user", "name email")
      .populate("doctor", "name email specialty");

    if (!appointment || appointment.isDeleted) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    return res.status(200).json({ data: appointment });
  } catch (err: any) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Update appointment (status, notes, date)
export const updateAppointment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, notes, appointmentDate } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { status, notes, appointmentDate },
      { new: true, runValidators: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    return res.status(200).json({
      message: "Appointment updated successfully",
      data: appointment,
    });
  } catch (err: any) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Cancel (soft delete) appointment
export const cancelAppointment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    appointment.status = "cancelled";
    appointment.isDeleted = true;
    appointment.cancelledAt = new Date();
    await appointment.save();

    return res.status(200).json({ message: "Appointment cancelled successfully" });
  } catch (err: any) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
