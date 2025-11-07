import { Router } from "express";
import { protect } from "../Middlewares/protect";
import * as doctorController from "../Controllers/doctor";
import { body } from "express-validator";
import asyncHandler from "../Middlewares/aysncHandler";

const router = Router();

const whatsappRegex = /^\+[1-9]\d{1,14}$/;

router.post('/create', [
  body("name", "Name is required").notEmpty(),
  body("specialty", "Specialty is required").notEmpty(),
  body("contact", "Contact is required").notEmpty()
    .custom((value, { req }) => {
      const cleanedValue = String(value).replace(/[^\d+]/g, '');
      if (!whatsappRegex.test(cleanedValue)) {
        throw new Error('Contact must be a valid WhatsApp number (e.g., +1234567890).');
      }
      req.body.contact = cleanedValue;
      return true;
    }),
],
  asyncHandler(doctorController.register));

router.get('/', protect, asyncHandler(doctorController.getDoctors));
router.get('/:id', protect, asyncHandler(doctorController.getDoctorById));

export default router;
