import { Doctor, IDoctor } from "../models/Doctor";

export async function createDoctor(doctorData: IDoctor): Promise<IDoctor> {
  const doctor = new Doctor(doctorData);
  return doctor.save();
}

export async function getAllDoctors(): Promise<IDoctor[]> {
  return Doctor.find().populate("appointments").exec();
}

export async function getDoctorById(id: string): Promise<IDoctor | null> {
  return Doctor.findById(id).populate("appointments").exec();
}

export async function updateDoctor(
  id: string,
  updateData: Partial<IDoctor>
): Promise<IDoctor | null> {
  return Doctor.findByIdAndUpdate(id, updateData, { new: true })
    .populate("appointments")
    .exec();
}

export async function deleteDoctor(id: string): Promise<IDoctor | null> {
  return Doctor.findByIdAndDelete(id).populate("appointments").exec();
}
