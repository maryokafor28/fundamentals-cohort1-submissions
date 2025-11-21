// controllers/v1/payment.controller.ts
import { Request, Response } from "express";
import { legacyService } from "../../services/legacy.service";
import { asyncHandler } from "../../utils/asyncHandler.utils";

export const getAllPayments = asyncHandler(
  async (req: Request, res: Response) => {
    const payments = await legacyService.fetchPayments();
    res.status(200).json({
      success: true,
      data: payments,
    });
  }
);

export const getPaymentById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const payment = await legacyService.fetchPaymentById(id);
    res.status(200).json({
      success: true,
      data: payment,
    });
  }
);
