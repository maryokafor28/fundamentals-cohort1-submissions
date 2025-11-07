import { PrismaClient } from "@prisma/client";
import { UserRepository } from '../../../repositories/UserRepository.js'
import { SubaccountRepository } from '../../../repositories/SubaccountRepository.js'
import { TransactionRepository } from '../../../repositories/TransactionRepository.js'

import { hashPassword, createJWT } from '../../../helpers.js'

let prisma = new PrismaClient()
const userRepository = new UserRepository(prisma);
const subaccountRepository = new SubaccountRepository(prisma);
const transactionRepository = new TransactionRepository(prisma);

// Validation helper
function validateSubaccountData(data) {
    const errors = [];

    // Required fields
    if (!data.phone) errors.push('Phone number is required');
    if (!data.username) errors.push('Username is required');
    if (!data.password) errors.push('Password is required');
    if (!data.birthdate) errors.push('Birthdate is required');
    if (!data.ownerID) errors.push('Owner ID is required');

    // Phone validation (adjust regex for your region)
    if (data.phone && !/^\+?[1-9]\d{1,14}$/.test(data.phone)) {
        errors.push('Invalid phone number format');
    }

    // Username validation
    if (data.username && (data.username.length < 3 || data.username.length > 30)) {
        errors.push('Username must be between 3 and 30 characters');
    }

    // Password strength
    if (data.password && data.password.length < 8) {
        errors.push('Password must be at least 8 characters');
    }

    // Spending limit validation
    if (data.spendingLimit !== undefined) {
        const limit = parseFloat(data.spendingLimit);
        if (isNaN(limit) || limit < 0) {
            errors.push('Spending limit must be a non-negative number');
        }
        if (limit > 100000) {
            errors.push('Spending limit exceeds maximum allowed amount');
        }
    }

    // Birthdate validation
    if (data.birthdate) {
        const birthDate = new Date(data.birthdate);
        if (isNaN(birthDate.getTime())) {
            errors.push('Invalid birthdate format');
        }
        
        // Check minimum age (e.g., 13 years old)
        const minAge = 13;
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (age < minAge || (age === minAge && monthDiff < 0)) {
            errors.push(`Subaccount holder must be at least ${minAge} years old`);
        }
    }

    return errors;
}

// Add subaccount for the user and add it as an account that can log in later
export async function addSubaccount(req, res) {
    try {
        // TODO: Add authentication middleware to verify req.user
        const authenticatedUserId = req.user?.id;
        
        if (!authenticatedUserId) {
            return res.status(401).json({ error: "Authentication required" });
        }

        // Validate input data
        const validationErrors = validateSubaccountData(req.body);
        if (validationErrors.length > 0) {
            return res.status(400).json({ 
                error: "Validation failed", 
                details: validationErrors 
            });
        }

        // Verify the authenticated user is the owner
        if (authenticatedUserId !== req.body.ownerID) {
            return res.status(403).json({ 
                error: "You can only create subaccounts for your own account" 
            });
        }

        // Check if phone number already exists
        const [existingPhoneFromSubaccounts, existingPhoneFromUsers] = await Promise.all([
            subaccountRepository.getSubaccountByPhone(req.body.phone),
            userRepository.findUserByPhone(req.body.phone)
        ]);

        if (existingPhoneFromSubaccounts || existingPhoneFromUsers) {
            return res.status(409).json({ error: "Phone number already registered" });
        }

        // Check if username already exists (FIXED: was using getSubaccountByPhone)
        const [existingUsernameFromSubaccounts, existingUsernameFromUsers] = await Promise.all([
            subaccountRepository.getSubaccountByUsername(req.body.username),
            userRepository.findUserByUsername(req.body.username)
        ]);

        if (existingUsernameFromSubaccounts || existingUsernameFromUsers) {
            return res.status(409).json({ error: "Username already registered" });
        }

        // Prepare subaccount data
        const subaccountData = {
            ...req.body,
            password: await hashPassword(req.body.password),
            birthdate: new Date(req.body.birthdate).setHours(0, 0, 0, 0),
            spendingLimit: parseFloat(req.body.spendingLimit || 0)
        };

        // Use Prisma transaction to ensure atomicity
        const result = await prisma.$transaction(async (tx) => {
            // Create the subaccount
            const newSubaccount = await subaccountRepository.createSubaccount(
                subaccountData, 
                tx
            );

            // If spending limit is set, transfer funds from owner
            if (subaccountData.spendingLimit > 0) {
                // Get owner's current balance
                const owner = await userRepository.findUserByID(
                    subaccountData.ownerID, 
                    tx
                );

                if (!owner) {
                    throw new Error("Owner account not found");
                }

                // Check sufficient balance
                if (owner.balance < subaccountData.spendingLimit) {
                    throw new Error("Insufficient balance");
                }

                // Deduct from owner's balance atomically
                await tx.user.update({
                    where: { UID: owner.UID },
                    data: { balance: { decrement: subaccountData.spendingLimit } }
                });

                // Create transaction record
                const transactionData = {
                    sender_id: subaccountData.ownerID,
                    recipientSubaccountUID: newSubaccount.id,
                    amount: subaccountData.spendingLimit,
                    status: "COMPLETED",
                    paymentMethod: "WALLET",
                    transactionType: "FUND_SUBACCOUNT"
                };

                await transactionRepository.createTransaction(transactionData, tx);
            }

            return newSubaccount;
        });

        // Generate JWT token
        const token = createJWT(result.id);

        // Remove sensitive data before sending response
        const { password, ...subaccountWithoutPassword } = result;

        return res.status(201).json({ 
            message: "Subaccount created successfully",
            subaccount: subaccountWithoutPassword,
            token 
        });

    } catch (error) {
        console.error('Error creating subaccount:', error);

        // Handle specific error types
        if (error.message === "Insufficient balance") {
            return res.status(400).json({ error: error.message });
        }
        
        if (error.message === "Owner account not found") {
            return res.status(404).json({ error: error.message });
        }

        // Generic error response
        return res.status(500).json({ 
            error: "Failed to create subaccount. Please try again." 
        });
    }
}

// Optional: Add endpoint to get subaccount details
export async function getSubaccountDetails(req, res) {
    try {
        const authenticatedUserId = req.user?.id;
        const { subaccountId } = req.params;

        if (!authenticatedUserId) {
            return res.status(401).json({ error: "Authentication required" });
        }

        const subaccount = await subaccountRepository.getSubaccountById(subaccountId);

        if (!subaccount) {
            return res.status(404).json({ error: "Subaccount not found" });
        }

        // Verify the authenticated user is the owner
        if (subaccount.ownerID !== authenticatedUserId) {
            return res.status(403).json({ 
                error: "Access denied" 
            });
        }

        // Remove sensitive data
        const { password, ...subaccountData } = subaccount;

        return res.status(200).json({ subaccount: subaccountData });

    } catch (error) {
        console.error('Error fetching subaccount:', error);
        return res.status(500).json({ 
            error: "Failed to fetch subaccount details" 
        });
    }
}