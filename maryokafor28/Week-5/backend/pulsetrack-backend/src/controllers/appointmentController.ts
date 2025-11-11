import { Request, Response } from "express";
import * as appointmentService from "../services/appointmentService";

export async function createAppointment(req: Request, res: Response) {
  try {
    const appointment = await appointmentService.createAppointment(req.body);
    res.status(201).json({ success: true, data: appointment });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}

export async function getAllAppointments(req: Request, res: Response) {
  try {
    const appointments = await appointmentService.getAllAppointments();
    res.status(200).json({ success: true, data: appointments });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function getAppointmentById(req: Request, res: Response) {
  try {
    const appointment = await appointmentService.getAppointmentById(
      req.params.id
    );
    if (!appointment)
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    res.status(200).json({ success: true, data: appointment });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function updateAppointment(req: Request, res: Response) {
  try {
    const appointment = await appointmentService.updateAppointment(
      req.params.id,
      req.body
    );
    if (!appointment)
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    res.status(200).json({ success: true, data: appointment });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}

export async function deleteAppointment(req: Request, res: Response) {
  try {
    const appointment = await appointmentService.deleteAppointment(
      req.params.id
    );
    if (!appointment)
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    res
      .status(200)
      .json({ success: true, message: "Appointment deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}
