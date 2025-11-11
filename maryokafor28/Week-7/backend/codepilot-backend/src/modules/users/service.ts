// src/modules/users/service.ts
import User from "./model";

export const getUserById = async (userId: string) => {
  return await User.findById(userId).select("-password");
};

export const updateUser = async (
  userId: string,
  data: { name?: string; email?: string }
) => {
  return await User.findByIdAndUpdate(
    userId,
    { $set: data },
    { new: true, runValidators: true }
  ).select("-password");
};
