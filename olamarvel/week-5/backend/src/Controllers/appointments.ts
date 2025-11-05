import { Request, Response } from "express";
import Appointment from "../Models/Appointments";
import User from "../Models/User";
import { validationResult } from "express-validator";
import { AuthRequest } from "../Middlewares/protect";

export const createAppointment = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    if (!req.body.user) {
      req.body.user = req.user.id;
    }
    const appt = await Appointment.create(req.body);
    await User.findByIdAndUpdate(appt.user, { $push: { appointments: appt._id } });
    res.status(201).json({ success: true, data: appt });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

export const getAppointments = async (req: AuthRequest, res: Response): Promise<Response> => {

  const appointments = await Appointment.find({ user: req.user.id })
    .populate({
      path: 'user',
      select: '-password -refreshTokens -__v'
    })
    .populate('doctor');

  return res.json({ success: true, data: appointments });
};

export const getAppointment = async (req: AuthRequest, res: Response): Promise<Response> => {

  const appointment = await Appointment.findById(req.params.id)
    .populate({
      path: 'user',
      select: '-password -refreshTokens -__v'
    })
    .populate('doctor');

  if (!appointment) {
    return res.status(404).json({ error: "Appointment not found" });
  }
  return res.json({ success: true, data: appointment });
};
