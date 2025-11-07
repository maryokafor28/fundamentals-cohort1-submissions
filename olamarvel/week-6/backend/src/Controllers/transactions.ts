import { Request, Response } from "express";
import { AuthRequest } from "../Middlewares/protect";
import { prisma } from "../config/db";
import logger from "../util/logger";
import { Transaction, User } from "@prisma/client";

export const getBalance = async (req: AuthRequest, res: Response) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" })
    const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: { balance: true },
    });
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json({ success: true, balance: user.balance });
};

export const sendFunds = async (req: AuthRequest, res: Response) => {

    if (!req.user) return res.status(401).json({ error: "Unauthorized" })
    const { recipientEmail, amount } = req.body;
    const senderId = req.user.id;

    const receiver = await prisma.user.findUnique({
        where: { email: recipientEmail },
    });
    if (!receiver) {
        return res.status(404).json({ error: "Recipient user does not exist" });
    }
    if (senderId === receiver.id) {
        return res.status(400).json({ error: "Cannot send funds to yourself" });
    }

    try {
        const transactionResult: Transaction = await prisma.$transaction(async (tx) => {
            const sender = await tx.user.findUnique({ where: { id: senderId } });

            if (!sender || sender.balance < amount) {
                throw new Error("Insufficient balance");
            }

            await tx.user.update({
                where: { id: senderId },
                data: { balance: { decrement: amount } },
            });

            await tx.user.update({
                where: { id: receiver.id },
                data: { balance: { increment: amount } },
            });

            const transaction = await tx.transaction.create({
                data: {
                    amount: amount,
                    type: "WITHDRAWAL",
                    senderId: senderId,
                    receiverId: receiver.id,
                },
            });
            return transaction;
        });
        res.status(201).json({ success: true, message: "Funds sent successfully", data: transactionResult });
    } catch (error) {
        logger.error(error, `Transaction failed for user ${senderId} to ${recipientEmail}`);

        if (error instanceof Error && error.message === "Insufficient balance") {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: "Transaction failed. Please try again." });
    }
};

export const getStatement = async (req: AuthRequest, res: Response) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" })
    const page = parseInt(req.query.page as string) || 1;
    const pagesize = parseInt(req.query.pagesize as string) || 10;
    const skip = (page - 1) * pagesize;

    const transactions: Transaction[] = await prisma.transaction.findMany({
        where: {
            OR: [{ senderId: req.user.id }, { receiverId: req.user.id }],
        },
        orderBy: { createdAt: "desc" },
        skip: skip,
        take: pagesize,
        include: {
            sender: { select: { name: true, email: true } },
            receiver: { select: { name: true, email: true } },
        },
    });

    const totalTransactions = await prisma.transaction.count({
        where: {
            OR: [{ senderId: req.user.id }, { receiverId: req.user.id }],
        },
    });

    res.status(200).json({
        success: true,
        data: transactions,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(totalTransactions / pagesize),
            totalTransactions,
        },
    });
};

export const depositFunds = async (req: AuthRequest, res: Response) => {
    const { amount } = req.body;
    if (!req.user) return res.status(401).json({ error: "Unauthorized" })
    const userId = req.user.id;

    try {
        const depositResult = await prisma.$transaction(async (tx) => {
            const updatedUser = await tx.user.update({
                where: { id: userId },
                data: { balance: { increment: amount } },
            });

            await tx.transaction.create({
                data: {
                    amount,
                    type: "DEPOSIT",
                    senderId: userId,
                    receiverId: userId,
                },
            });

            return updatedUser;
        });

        res.status(200).json({
            success: true,
            message: "Deposit successful",
            newBalance: depositResult.balance,
        });
    } catch (error) {
        logger.error(error, `Deposit failed for user ${userId}`);
        res.status(500).json({ error: "Deposit failed. Please try again." });
    }
};
