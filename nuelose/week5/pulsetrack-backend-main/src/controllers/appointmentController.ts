import { Request, Response } from "express";
import { Appointment, User, Doctor } from "../models/index.js";

export const createAppointment = async (req: Request, res: Response) => {
  try {
    const { email, doctorEmail, date, reason } = req.body;

    const existingUser = await User.findOne({email});
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingDoctor = await Doctor.findOne({email:doctorEmail});
    if (!existingDoctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const newAppointment = await Appointment.create({
      user: existingUser._id,
      doctor: existingDoctor._id,
      date,
      reason,
    });

    existingUser.appointments.push(newAppointment.id);
    await existingUser.save();

    const populateAppointment = await newAppointment.populate("user");
    res.status(201).json(populateAppointment);
  } catch (error) {
    res.status(400).json({ message: "Error creating appointment", error });
  }
};

export const getAppointments = async (_req: Request, res: Response) => {
  try {
    const appointments = await Appointment.find()
      .populate("user", "name")
      .populate("doctor", "name specialty");
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointments", error });
  }
};

export const getAppointmentById = async (req: Request, res: Response) => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate(
      "user doctor"
    );
    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointment", error });
  }
};

export const updateAppointment = async (req: Request, res: Response) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });
    res.json(appointment);
  } catch (error) {
    res.status(400).json({ message: "Error updating appointment", error });
  }
};

export const deleteAppointment = async (req: Request, res: Response) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });
    res.json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting appointment", error });
  }
};
