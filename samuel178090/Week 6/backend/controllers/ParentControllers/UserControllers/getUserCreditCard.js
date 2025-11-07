import { PrismaClient } from "@prisma/client";
import { UserRepository } from '../../../repositories/UserRepository.js'
import { VccRepository } from '../../../repositories/VirtualCreditCardRepository.js'

let prisma = new PrismaClient()
const userRepository = new UserRepository(prisma);
const vccRepository = new VccRepository(prisma)

export async function getCreditCard(req, res) {
    try {
        // Authentication check
        const authenticatedUserId = req.user?.id;
        
        if (!authenticatedUserId) {
            return res.status(401).json({ error: "Authentication required" });
        }

        // Use authenticated user ID
        const user = await userRepository.findUserByID(authenticatedUserId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if there's a credit card associated with the user
        const creditCard = await vccRepository.getCreditCardByUser(authenticatedUserId);

        if (creditCard) {
            return res.status(200).json({ 
                success: true,
                virtualCreditCard: creditCard 
            });
        } else {
            return res.status(200).json({ 
                success: true,
                message: "No virtual credit card found for this user.",
                virtualCreditCard: null
            });
        }
        
    } catch (error) {
        console.error('Error getting credit card:', error);
        return res.status(500).json({ 
            error: 'Failed to retrieve credit card information. Please try again.' 
        });
    }
}