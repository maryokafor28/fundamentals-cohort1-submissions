import { Request, Response } from "express";
import { Doctor } from "../models/doctor.model";
import { Patient } from "../models/patient.model";

export const createPatient = async (req: Request, res: Response) => {
  console.log(req.body);
  try {
    const { name, email, phone, gender, dob, bloodGroup, address, report } =
      req.body;

    const { _id } = req.user!;

    if (
      !name ||
      !email ||
      !phone ||
      !gender ||
      !dob ||
      !bloodGroup ||
      !address
    ) {
      return res.status(400).send({
        message: "All required fields must be provided.",
        status: false,
      });
    }

    const doctorExists = await Doctor.findById(_id);
    if (!doctorExists) {
      return res
        .status(404)
        .send({ message: "Assigned doctor not found.", status: false });
    }

    const existingPatient = await Patient.findOne({
      $or: [{ email }, { phone }],
    });
    if (existingPatient) {
      return res.status(409).send({
        message: "Patient with this email or phone already exists.",
        status: false,
      });
    }

    const newPatient = await Patient.create({
      name,
      email,
      phone,
      gender,
      dob,
      bloodGroup,
      address,
      report,
      doctor: _id,
    });

    res.status(201).send({
      message: "Patient created successfully.",
      patient: newPatient,
      status: true,
    });
  } catch (error: any) {
    console.error("Error creating patient:", error);
    res.status(500).send({
      message: "Server error while creating patient.",
      error: error.message,
      status: false,
    });
  }
};

///////////////////////////////////////////////////////

export const getPatient = async (req: Request, res: Response) => {
  const { _id } = req.user!;
  console.log(_id);
  try {
    Patient.find({ doctor: _id }).then((patient) => {
      if (!patient) {
        return res
          .status(400)
          .send({ message: "Patient not found", status: false });
      }
      res
        .status(200)
        .send({ message: "found patients", patient, status: true });
    });
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: "Something is wrong" });
  }
};

////////////////////////////////////////////////////////
export const deletePatient = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedPatient = await Patient.findByIdAndDelete(id);
    if (!deletedPatient) {
      return res
        .status(404)
        .send({ message: "Patient not found", status: false });
    }
    res
      .status(200)
      .send({ message: "Patient deleted successfully", status: true });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Server error", status: false });
  }
};

////////////////////////////////////////////////////////
export const updatePatient = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const updatedPatient = await Patient.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedPatient) {
      return res
        .status(404)
        .send({ message: "Patient not found", status: false });
    }
    res.status(200).send({
      message: "Patient updated successfully",
      patient: updatedPatient,
      status: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Server error", status: false });
  }
};

////////////////////////////////////////////////////////
export const getPatientById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const patient = await Patient.findById(id);
    if (!patient) {
      return res
        .status(404)
        .send({ message: "Patient not found", status: false });
    }
    res.status(200).send({ message: "Patient found", patient, status: true });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Server error", status: false });
  }
};
////////////////////////////////////////////////////////
