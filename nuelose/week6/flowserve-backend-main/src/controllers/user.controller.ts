import { Request, Response, NextFunction } from "express";
import prisma from "../prisma/client";
import { ApiError } from "../middlewares/errorHandler";
import { CreateUserInput } from "../schemas/user.schema";
import logger from "../utils/logger";

export const listUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));

    const total = await prisma.user.count();
    const users = await prisma.user.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    });
    const totalPages = Math.ceil(total / limit);

    res.json({
      data: users,
      meta: { total, page, limit, totalPages },
    });
  } catch (error) {
    next(new ApiError("Failed to list users", 500, error));
  }
};

export const createUser = async (
  req: Request<{}, {}, CreateUserInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, name, balance } = req.body;
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      throw new ApiError("User Already exist", 401);
    }
    logger.info("Creating new user", { email });

    const newUser = await prisma.user.create({
      data: { email, name, balance },
    });

    return res
      .status(201)
      .json({ message: "Successfully created user", data: newUser });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;


    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      throw new ApiError("User not found", 404);
    }

    return res
      .status(201)
      .json({ message: `User fetched successfully`, data: user });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    next(error);
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { name, email, balance } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      throw new ApiError("User not found", 404);
    }
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name: name ?? existingUser.name,
        email: email ?? existingUser.email,
        balance: balance ?? existingUser.balance
      },
    });

    return res.status(200).json({
      message: `User with id ${id} updated successfully`,
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;

    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      throw new ApiError("User not found", 404);
    }

    

    await prisma.user.delete({ where: { id } });
    return res.status(200).json({ message: `User ${id} deleted successfully` });
  } catch (error) {
    next(error);
  }
};
