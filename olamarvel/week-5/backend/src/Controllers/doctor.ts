import { Request, Response } from "express";
import Doctor from "../Models/Doctor";
import { AuthRequest } from "../Middlewares/protect";
import { validationResult } from "express-validator";
import Appointments from "../Models/Appointments";
import { IUser } from "../Models/User";

export const getDoctors = async (req: AuthRequest, res: Response): Promise<Response> => {
    try {
        const doctors = await Doctor.find({});
        return res.status(200).json({ success: true, data: doctors });
    } catch (error) {
        console.error("Error fetching doctors:", error);
        return res.status(500).json({ success: false, error: "Server error while fetching doctors" });
    }
}


export const getDoctorById = async (req: AuthRequest, res: Response): Promise<Response> => {
    try {
        const doctor = await Doctor.findById(req.params.id); // Find the doctor
        if (!doctor) {
            return res.status(404).json({ success: false, error: "Doctor not found" })
        }

        // Find all appointments involving this doctor and populate the 'user' field
        const appointments = await Appointments.find({ doctor: doctor._id })
            .populate({
                path: 'user',
                select: '-password -refreshTokens -__v' // Exclude sensitive user fields
            })
            .select('user'); // Only select the user field from appointments

        // Extract unique users from the appointments
        const interactingUsersMap = new Map();
        appointments.forEach(appt => {
            if (appt.user) {
                // Ensure it's a populated user object, not just an ID string
                const user = appt.user as any; // Type assertion for populated user
                if (!interactingUsersMap.has(user._id.toString())) {
                    interactingUsersMap.set(user._id.toString(), {
                        _id: user._id,
                        name: user.name
                    });
                }
            }
        });

        const interactingUsers = Array.from(interactingUsersMap.values());

        // Return the doctor data along with the list of interacting users
        return res.status(200).json({ success: true, data: { ...doctor.toObject(), interactingUsers } });

    } catch (error) {
        console.error("Error fetching doctor by ID:", error);
        return res.status(500).json({ success: false, error: "Server error while fetching doctor details" })
    }
}

export const register = async (req: Request, res: Response): Promise<Response> => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const doctor = await Doctor.create(req.body);
    return res.status(201).json({ success: true, data: doctor });
}