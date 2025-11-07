import { PrismaClient } from "@prisma/client";
import { SubaccountRepository } from '../../../repositories/SubaccountRepository.js'

let prisma = new PrismaClient()
const subaccountRepository = new SubaccountRepository(prisma);

export async function getSubaccount(req, res) {
    try {
        // Authentication check
        const authenticatedUserId = req.user?.id;
        const authenticatedUserRole = req.user?.role; // 'USER' or 'SUBACCOUNT'
        
        if (!authenticatedUserId) {
            return res.status(401).json({ error: "Authentication required" });
        }

        // Validate subaccount ID
        const { id } = req.params;
        if (!id || typeof id !== 'string') {
            return res.status(400).json({ error: "Invalid subaccount ID" });
        }

        // Fetch subaccount
        const subaccount = await subaccountRepository.getSubaccountByID(id);
        
        if (!subaccount) {
            return res.status(404).json({ error: 'Subaccount not found' });
        }

        // Authorization check - verify user has permission to view this subaccount
        const hasPermission = 
            // Case 1: Owner viewing their subaccount
            subaccount.ownerID === authenticatedUserId ||
            // Case 2: Subaccount viewing their own profile
            (authenticatedUserRole === 'SUBACCOUNT' && subaccount.id === authenticatedUserId);

        if (!hasPermission) {
            return res.status(403).json({ 
                error: "Access denied. You don't have permission to view this subaccount" 
            });
        }

        // Remove sensitive data before sending response
        const { password, ...subaccountData } = subaccount;

        return res.status(200).json({ 
            subaccount: subaccountData 
        });

    } catch (error) {
        console.error('Error fetching subaccount:', error);
        
        // Don't expose internal error details to client
        return res.status(500).json({ 
            error: "Failed to retrieve subaccount. Please try again." 
        });
    }
}