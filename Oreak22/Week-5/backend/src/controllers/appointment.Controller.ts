import { Request, Response } from "express";
import { Doctor } from "../models/doctor.model";
import { Patient } from "../models/patient.model";
import Appointment from "../models/appointment.model";
import { countReset } from "console";

//
// 🆕 Create Appointment
//
export const createAppointment = async (req: Request, res: Response) => {
  try {
    const doctorId = req.user?._id;
    const {
      doctorName,
      patientId,
      patientName,
      appointmentDate,
      appointmentTime,
      reason,
      notes,
    } = req.body;

    const [doctor, patient] = await Promise.all([
      Doctor.findById(doctorId),
      Patient.findById(patientId),
    ]);

    if (!patient) return res.status(404).send({ message: "Patient not found" });
    if (!doctor) return res.status(404).send({ message: "Doctor not found" });

    const appointment = await Appointment.create({
      doctor: doctorId,
      patient: patientId,
      patientName,
      doctorName,
      appointmentDate,
      appointmentTime,
      reason,
      notes,
    });

    res.status(201).send({
      message: "Appointment created successfully",
      appointment,
    });
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).send({ message: "Server error", error });
  }
};

//
// 📋 Get All Appointments
//
export const getAppointments = async (req: Request, res: Response) => {
  try {
    const appointments = await Appointment.find()
      .populate("doctor", "name department designation")
      .populate("patient", "name email phone")
      .sort({ createdAt: -1 });

    res.status(200).send(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).send({ message: "Server error", error });
  }
};

//
// 🔍 Get Single Appointment by ID
//
export const getAppointmentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id)
      .populate("doctor", "name department designation email phone")
      .populate("patient", "name email phone gender age");

    if (!appointment)
      return res.status(404).send({ message: "Appointment not found" });

    res.status(200).send(appointment);
  } catch (error) {
    console.error("Error fetching appointment:", error);
    res.status(500).send({ message: "Server error", error });
  }
};

//
// ✏️ Update Appointment (e.g., status or notes)
//
export const updateAppointment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const appointment = await Appointment.findByIdAndUpdate(id, updateData, {
      new: true,
    })
      .populate("doctor", "name department")
      .populate("patient", "name email phone");

    if (!appointment)
      return res.status(404).send({ message: "Appointment not found" });

    res.status(200).send({
      message: "Appointment updated successfully",
      appointment,
    });
  } catch (error) {
    console.error("Error updating appointment:", error);
    res.status(500).send({ message: "Server error", error });
  }
};

//
// 🗑 Delete Appointment
//
export const deleteAppointment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findOneAndDelete({ _id: id });

    if (!appointment)
      return res.status(404).send({ message: "Appointment not found" });

    // The post middleware in Appointment model will auto unlink doctor/patient

    res.status(200).send({ message: "Appointment deleted successfully" });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    res.status(500).send({ message: "Server error", error });
  }
};
