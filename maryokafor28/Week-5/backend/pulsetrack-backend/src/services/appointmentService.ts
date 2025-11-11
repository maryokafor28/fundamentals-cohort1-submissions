import { Appointment, IAppointment } from "../models/Appointment";

export async function createAppointment(
  data: IAppointment
): Promise<IAppointment> {
  const appointment = new Appointment(data);
  return await appointment.save();
}

export async function getAllAppointments(): Promise<IAppointment[]> {
  return await Appointment.find().populate("user doctor").exec();
}

export async function getAppointmentById(
  id: string
): Promise<IAppointment | null> {
  return await Appointment.findById(id).populate("user doctor").exec();
}

export async function updateAppointment(
  id: string,
  updateData: Partial<IAppointment>
): Promise<IAppointment | null> {
  return await Appointment.findByIdAndUpdate(id, updateData, { new: true })
    .populate("user doctor")
    .exec();
}

export async function deleteAppointment(
  id: string
): Promise<IAppointment | null> {
  return await Appointment.findByIdAndDelete(id).populate("user doctor").exec();
}
