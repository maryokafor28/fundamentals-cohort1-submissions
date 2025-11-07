import { PrismaClient } from "@prisma/client";
import { validateNID } from "../../../services/NationalIDServices.js";
import { hashPassword, createJWT } from '../../../helpers.js';
import fs from 'fs';
import path from 'path';

import { UserRepository } from '../../../repositories/UserRepository.js';
import { SubaccountRepository } from '../../../repositories/SubaccountRepository.js';

const prisma = new PrismaClient();
const userRepository = new UserRepository(prisma);
const subaccountRepository = new SubaccountRepository(prisma);

/**
 * User registration controller
 * @route POST /auth/register
 * @body { firstName, lastName, username, email, phone, password, nationalID, birthdate }
 * @files { image }
 */
export async function signUp(req, res, next) {
  let uploadedFilePath = null;

  try {
    // ============ STEP 1: Validate File Upload ============
    if (!req.files || !req.files.image || req.fileError) {
      return res.status(400).json({ 
        message: "National ID image is required" 
      });
    }

    uploadedFilePath = `uploads/NationalIDs/${req.files.image[0].filename}`;

    // ============ STEP 2: Validate Required Fields ============
    const { 
      firstName, 
      lastName, 
      username, 
      email, 
      phone, 
      password, 
      nationalID, 
      birthdate 
    } = req.body;

    // Check required fields
    const requiredFields = {
      firstName, lastName, username, email, 
      phone, password, nationalID, birthdate
    };

    for (const [field, value] of Object.entries(requiredFields)) {
      if (!value || value.trim() === '') {
        safeDeleteFile(uploadedFilePath);
        return res.status(400).json({ 
          message: `${field} is required` 
        });
      }
    }

    // ============ STEP 3: Validate Field Formats ============
    
    // Validate phone format (11 digits)
    if (!/^\d{11}$/.test(phone)) {
      safeDeleteFile(uploadedFilePath);
      return res.status(400).json({ 
        message: "Phone number must be 11 digits" 
      });
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      safeDeleteFile(uploadedFilePath);
      return res.status(400).json({ 
        message: "Invalid email format" 
      });
    }

    // Validate password strength (minimum 6 characters)
    if (password.length < 6) {
      safeDeleteFile(uploadedFilePath);
      return res.status(400).json({ 
        message: "Password must be at least 6 characters" 
      });
    }

    // Validate username (3-20 characters, alphanumeric)
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
      safeDeleteFile(uploadedFilePath);
      return res.status(400).json({ 
        message: "Username must be 3-20 characters (letters, numbers, underscore only)" 
      });
    }

    // ============ STEP 4: Validate National ID ============
    if (!validateNID(nationalID)) {
      safeDeleteFile(uploadedFilePath);
      return res.status(400).json({ 
        message: "Invalid National ID format" 
      });
    }

    // ============ STEP 5: Check for Existing National ID ============
    const existingNationalID = await userRepository.findUserByNationalID(nationalID);

    if (existingNationalID) {
      safeDeleteFile(uploadedFilePath);
      return res.status(409).json({ 
        message: "National ID is already registered" 
      });
    }

    // ============ STEP 6: Check for Existing Phone ============
    const existingPhoneFromUsers = await userRepository.findUserByPhone(phone);
    const existingPhoneFromSubaccounts = await subaccountRepository.getSubaccountByPhone(phone);

    if (existingPhoneFromUsers || existingPhoneFromSubaccounts) {
      safeDeleteFile(uploadedFilePath);
      return res.status(409).json({ 
        message: "Phone number is already registered" 
      });
    }

    // ============ STEP 7: Check for Existing Username ============
    const existingUsernameFromUsers = await userRepository.findUserByUsername(username);
    const existingUsernameFromSubaccounts = await subaccountRepository.getSubaccountByUsername(username); // Fixed: was using phone

    if (existingUsernameFromUsers || existingUsernameFromSubaccounts) {
      safeDeleteFile(uploadedFilePath);
      return res.status(409).json({ 
        message: "Username is already taken" 
      });
    }

    // ============ STEP 8: Check for Existing Email ============
    const existingEmail = await userRepository.findUserByEmail(email);

    if (existingEmail) {
      safeDeleteFile(uploadedFilePath);
      return res.status(409).json({ 
        message: "Email is already registered" 
      });
    }

    // ============ STEP 9: Process User Data ============
    
    // Hash password
    const hashedPassword = await hashPassword(password);

    // Prepare birthdate
    const birthdateObject = new Date(birthdate);
    birthdateObject.setHours(0, 0, 0, 0);

    // Prepare user data
    const userData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      username: username.trim().toLowerCase(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      password: hashedPassword,
      nationalID: nationalID.trim(),
      birthdate: birthdateObject,
      nationalIdFileName: uploadedFilePath,
      balance: 0,
    };

    // ============ STEP 10: Create User ============
    const user = await userRepository.createUser(userData);

    // ============ STEP 11: Generate JWT Token ============
    const token = createJWT(user.UID); // Fixed: was using user.id

    // ============ STEP 12: Return Success Response ============
    return res.status(201).json({
      success: true,
      message: "Registration successful",
      user: {
        id: user.UID,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        phone: user.phone,
        balance: user.balance,
      },
      token: token
    });

  } catch (error) {
    // Clean up uploaded file on error
    safeDeleteFile(uploadedFilePath);

    console.error('Signup error:', error);

    // Don't expose internal errors
    return res.status(500).json({ 
      message: "Registration failed. Please try again." 
    });
  }
}

/**
 * Safely delete file if it exists
 * @param {string} filePath - Path to file
 */
function safeDeleteFile(filePath) {
  if (!filePath) return;
  
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Deleted file: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error deleting file ${filePath}:`, error);
  }
}