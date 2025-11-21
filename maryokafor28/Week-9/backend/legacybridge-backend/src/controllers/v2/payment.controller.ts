import { Request, Response } from "express";
import { paymentService } from "../../services/payment.service";
import { asyncHandler } from "../../utils/asyncHandler.utils";

/**
 * GET /v2/payments
 */
export const getAllPayments = asyncHandler(
  async (req: Request, res: Response) => {
    const payments = await paymentService.getAllPayments();
    res.status(200).json({
      success: true,
      data: payments,
    });
  }
);

/**
 * GET /v2/payments/:id
 */
export const getPaymentById = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const payment = await paymentService.getPaymentById(id);
    res.status(200).json({
      success: true,
      data: payment,
    });
  }
);
