// controllers/customer.controller.ts
import { Request, Response } from "express";
import { customerService } from "../../services/customer.service";
import { asyncHandler } from "../../utils/asyncHandler.utils";

export const getAllCustomers = asyncHandler(
  async (req: Request, res: Response) => {
    const customers = await customerService.getAllCustomers();
    res.status(200).json({
      success: true,
      data: customers,
    });
  }
);

export const getCustomerById = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const customer = await customerService.getCustomerById(id);
    res.status(200).json({
      success: true,
      data: customer,
    });
  }
);
