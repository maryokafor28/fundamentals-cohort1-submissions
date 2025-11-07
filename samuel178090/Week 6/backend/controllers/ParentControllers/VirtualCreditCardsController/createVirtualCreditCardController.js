import { PrismaClient } from "@prisma/client";
import { UserRepository } from '../../../repositories/UserRepository.js'
import { VccRepository } from '../../../repositories/VirtualCreditCardRepository.js'
import { fetchCCData } from '../../../services/CreditCardServices.js'

let prisma = new PrismaClient()
const userRepository = new UserRepository(prisma);
const vccRepository = new VccRepository(prisma);

export async function createVCC(req, res) {
    try {
        // Authentication check
        const authenticatedUserId = req.user?.id;
        
        if (!authenticatedUserId) {
            return res.status(401).json({ error: "Authentication required" });
        }

        const { visa_type, amount } = req.body;

        // Input validation
        if (!visa_type || !amount) {
            return res.status(400).json({ 
                error: "Visa type and amount are required" 
            });
        }

        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            return res.status(400).json({ 
                error: "Amount must be a positive number" 
            });
        }

        const validTypes = ['visa', 'mastercard', 'amex', 'jcb'];
        if (!validTypes.includes(visa_type.toLowerCase())) {
            return res.status(400).json({ 
                error: "Invalid visa type. Must be one of: visa, mastercard, amex, jcb" 
            });
        }

        // Get authenticated user
        const user = await userRepository.findUserByID(authenticatedUserId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check user balance
        if (parsedAmount > user.balance) {
            return res.status(400).json({ error: "Insufficient balance" });
        }

        // Check existing VCC
        const existingVCC = await vccRepository.getCreditCardByUser(authenticatedUserId);
        const now = new Date();

        if (existingVCC && existingVCC.expirationDate > now && !existingVCC.usedFlag) {
            return res.status(400).json({ 
                error: "You already have an active virtual credit card",
                virtualCreditCard: existingVCC 
            });
        }

        // Clean up expired/used VCC
        if (existingVCC && (existingVCC.expirationDate <= now || existingVCC.usedFlag)) {
            await vccRepository.deleteVCC(existingVCC.id);
        }

        // Generate VCC using database transaction
        const result = await prisma.$transaction(async (tx) => {
            // Generate card number
            const apiResponse = await fetchCCData(visa_type);
            if (apiResponse.isAxiosError) {
                throw new Error("Failed to generate credit card number");
            }

            let ccnumber = apiResponse.data[0].cardNumber;
            
            // Ensure uniqueness
            let checkExisting = await vccRepository.getCreditCardByCCNumber(ccnumber);
            while (checkExisting) {
                const newResponse = await fetchCCData(visa_type);
                ccnumber = newResponse.data[0].cardNumber;
                checkExisting = await vccRepository.getCreditCardByCCNumber(ccnumber);
            }

            const ccType = visa_type.toLowerCase();
            const fullname = `${user.firstName} ${user.LastName}`;
            const expirationDate = new Date();
            expirationDate.setHours(expirationDate.getHours() + 24);

            // Generate CVC
            const cvc = (ccType === 'visa' || ccType === 'mastercard') 
                ? Math.floor(Math.random() * 900) + 100
                : Math.floor(Math.random() * 9000) + 1000;

            const VCCData = {
                cardNumber: ccnumber,
                amount: parsedAmount,
                expirationDate,
                usedFlag: false,
                creditCardType: ccType,
                ccHolderName: fullname,
                verificationCode: cvc,
                userId: authenticatedUserId
            };

            return await vccRepository.createVCC(VCCData);
        });

        return res.status(201).json({ 
            success: true,
            message: "Virtual credit card created successfully",
            virtualCreditCard: result 
        });
        
    } catch (error) {
        console.error('Error creating VCC:', error);
        return res.status(500).json({ 
            error: "Failed to create virtual credit card. Please try again." 
        });
    }
} 