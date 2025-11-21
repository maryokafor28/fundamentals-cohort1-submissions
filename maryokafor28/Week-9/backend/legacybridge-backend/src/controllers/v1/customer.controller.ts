// controllers/v1/customer.controller.ts
import { Request, Response } from "express";
import { legacyService } from "../../services/legacy.service";
import { asyncHandler } from "../../utils/asyncHandler.utils";

export const getAllCustomers = asyncHandler(
  async (req: Request, res: Response) => {
    const customers = await legacyService.fetchCustomers();
    res.status(200).json({
      success: true,
      data: customers,
    });
  }
);

export const getCustomerById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const customer = await legacyService.fetchCustomerById(id);
    res.status(200).json({
      success: true,
      data: customer,
    });
  }
);
