import { PrismaClient } from "@prisma/client";
import { UserRepository } from '../../../repositories/UserRepository.js'
import { SubaccountRepository } from '../../../repositories/SubaccountRepository.js'
import { TransactionRepository } from '../../../repositories/TransactionRepository.js'

let prisma = new PrismaClient()
const subaccountRepository = new SubaccountRepository(prisma);
const userRepository = new UserRepository(prisma);
const transactionRepository = new TransactionRepository(prisma);

export async function deleteSubaccount(req, res) {
    try {
        // Authentication check
        const authenticatedUserId = req.user?.id;
        const authenticatedUserRole = req.user?.role;
        
        if (!authenticatedUserId) {
            return res.status(401).json({ error: "Authentication required" });
        }

        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({ error: "Subaccount ID is required" });
        }

        const subaccount = await subaccountRepository.getSubaccountByID(id);

        if (!subaccount) {
            return res.status(404).json({ error: 'Subaccount not found' });
        }

        // Authorization check - only owner can delete subaccount
        if (subaccount.ownerID !== authenticatedUserId) {
            return res.status(403).json({ 
                error: "Access denied. You can only delete your own subaccounts" 
            });
        }

        // Use database transaction for atomicity
        await prisma.$transaction(async (tx) => {
            // If subaccount has balance, return it to owner
            if (subaccount.spendingLimit > 0) {
                const owner = await userRepository.findUserByID(subaccount.ownerID);
                const newOwnerBalance = owner.balance + subaccount.spendingLimit;
                
                await userRepository.updateBalance(subaccount.ownerID, newOwnerBalance);

                // Create transaction record for balance return
                await transactionRepository.createTransaction({
                    senderSubaccountUID: subaccount.id,
                    recipient_id: owner.UID,
                    amount: subaccount.spendingLimit,
                    status: "COMPLETED",
                    paymentMethod: "WALLET",
                    transactionType: "FUND_SUBACCOUNT",
                    transactionLevel: "CHILD"
                });
            }

            // Delete the subaccount
            await subaccountRepository.deleteSubaccount(id);
        });

        return res.status(204).send();
        
    } catch (error) {
        console.error('Error deleting subaccount:', error);
        return res.status(500).json({ 
            error: "Failed to delete subaccount. Please try again." 
        });
    }
}