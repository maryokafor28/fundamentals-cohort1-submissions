import { PrismaClient } from "@prisma/client";
import { UserRepository } from '../../../repositories/UserRepository.js'
import { TransactionRepository } from '../../../repositories/TransactionRepository.js'
import { SubaccountRepository } from '../../../repositories/SubaccountRepository.js'

let prisma = new PrismaClient()
const userRepository = new UserRepository(prisma);
const subaccountRepository = new SubaccountRepository(prisma);
const transactionRepository = new TransactionRepository(prisma);

export async function updateSubaccount(req, res) {
    try {
        // Authentication check
        const authenticatedUserId = req.user?.id;
        const authenticatedUserRole = req.user?.role;
        
        if (!authenticatedUserId) {
            return res.status(401).json({ error: "Authentication required" });
        }

        const { id } = req.params;
        const {
            firstName,
            lastName,
            phone,
            password: newPassword,
            username,
            email,
            spendingLimit,
            spendingCategories,
            dailyLimit,
            monthlyLimit,
            transactionLimit,
        } = req.body;

        if (!id) {
            return res.status(400).json({ error: "Subaccount ID is required" });
        }

        const subaccount = await subaccountRepository.getSubaccountByID(id);

        if (!subaccount) {
            return res.status(404).json({ error: "Subaccount not found" });
        }

        // Authorization check
        const hasPermission = 
            subaccount.ownerID === authenticatedUserId ||
            (authenticatedUserRole === 'SUBACCOUNT' && subaccount.id === authenticatedUserId);

        if (!hasPermission) {
            return res.status(403).json({ 
                error: "Access denied. You can only update your own subaccounts" 
            });
        }

        // Subaccounts can only update limited fields
        if (authenticatedUserRole === 'SUBACCOUNT') {
            const allowedFields = ['firstName', 'lastName', 'email', 'password'];
            const requestedFields = Object.keys(req.body);
            const unauthorizedFields = requestedFields.filter(field => !allowedFields.includes(field));
            
            if (unauthorizedFields.length > 0) {
                return res.status(403).json({ 
                    error: `Subaccounts cannot update: ${unauthorizedFields.join(', ')}` 
                });
            }
        }
        const updatedFields = {};

        // Only update fields that are provided in the request
        if (firstName) updatedFields.firstName = firstName;
        if (lastName) updatedFields.lastName = lastName;
        if (phone) updatedFields.phone = phone;
        if (newPassword) updatedFields.password = newPassword;
        if (email) updatedFields.email = email;
        if (spendingCategories) updatedFields.spendingCategories = spendingCategories;
        if (dailyLimit) updatedFields.dailyLimit = dailyLimit;
        if (monthlyLimit) updatedFields.monthlyLimit = monthlyLimit;
        if (transactionLimit) updatedFields.transactionLimit = transactionLimit;

        // Handle spending limit changes (only owners can do this)
        if (spendingLimit !== undefined && authenticatedUserRole === 'USER') {
            const oldSpendingLimit = subaccount.spendingLimit;
            const difference = spendingLimit - oldSpendingLimit;

            if (difference !== 0) {
                const owner = await userRepository.findUserByID(subaccount.ownerID);
                
                // Use database transaction for atomicity
                await prisma.$transaction(async (tx) => {
                    let transactionData;

                    if (difference > 0) {
                        // Increasing spending limit - check owner balance
                        if (owner.balance < difference) {
                            throw new Error("Insufficient balance");
                        }

                        const newOwnerBalance = owner.balance - difference;
                        await userRepository.updateBalance(owner.UID, newOwnerBalance);

                        transactionData = {
                            sender_id: owner.UID,
                            recipientSubaccountUID: subaccount.id,
                            amount: difference,
                            status: "COMPLETED",
                            paymentMethod: "WALLET",
                            transactionType: "FUND_SUBACCOUNT"
                        };
                    } else {
                        // Decreasing spending limit - return money to owner
                        const returnAmount = Math.abs(difference);
                        const newOwnerBalance = owner.balance + returnAmount;
                        await userRepository.updateBalance(owner.UID, newOwnerBalance);

                        transactionData = {
                            senderSubaccountUID: subaccount.id,
                            recipient_id: owner.UID,
                            amount: returnAmount,
                            status: "COMPLETED",
                            paymentMethod: "WALLET",
                            transactionType: "FUND_SUBACCOUNT",
                            transactionLevel: "CHILD"
                        };
                    }

                    await transactionRepository.createTransaction(transactionData);
                });
            }
            
            updatedFields.spendingLimit = spendingLimit;
        }

        const updatedSubaccount = await subaccountRepository.updateSubaccount(id, updatedFields);

        // Remove sensitive data before sending response
        const { password, ...subaccountData } = updatedSubaccount;

        return res.status(200).json({ 
            success: true,
            message: "Subaccount updated successfully",
            subaccount: subaccountData 
        });
        
    } catch (error) {
        console.error('Error updating subaccount:', error);
        
        if (error.message === "Insufficient balance") {
            return res.status(400).json({ error: error.message });
        }
        
        return res.status(500).json({ 
            error: "Failed to update subaccount. Please try again." 
        });
    }
}

