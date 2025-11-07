import { userService } from "../services/userService.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/asyncWrapper.js";
import { addHATEOASLinks } from "../utils/hateoasHelper.js";

export const createUser = catchAsync(async (req, res, next) => {
  const user = await userService.createUser(req.body);
  const userWithLinks = addHATEOASLinks(user, "/api/v1/users");

  res.status(201).json({
    status: "success",
    data: userWithLinks,
  });
});

export const getUsers = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  const users = await userService.getUsers(Number(page), Number(limit));

  res.status(200).json({
    status: "sucess",
    result: users.lenght,
    data: users.map((u) => addHATEOASLinks(u, "/api/v1/users")),
  });
});

export const getUserById = catchAsync(async (req, res, next) => {
  const user = await userService.getUserById(Number(req.params.id));
  if (!user) return next(new AppError("user not found", 404));
  res.status(200).json({
    status: "sucess",
    data: addHATEOASLinks(user, "api/v1/users"),
  });
});

export const updateUser = catchAsync(async (req, res, next) => {
  const user = await userService.updateUser(Number(req.params.id), req.body);
  if (!user) return next(new AppError("user not found", 404));
  res.status(200).json({
    status: "success",
    data: addHATEOASLinks(user, "/api/v1/users"),
  });
});

export const deleteUser = catchAsync(async (req, res, next) => {
  const user = await userService.deleteUser(Number(req.params.id));
  if (!user) return next(new AppError("User not found", 404));

  res.status(200).json({
    status: "success",
    message: "User deleted successfully",
  });
});
