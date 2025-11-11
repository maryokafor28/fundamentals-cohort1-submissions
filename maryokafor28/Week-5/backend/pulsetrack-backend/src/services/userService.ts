import { User, IUser } from "../models/User";

/**
 * Fetch all users (accessible to both patients and doctors)
 */
export async function getAllUsers(): Promise<IUser[]> {
  return User.find()
    .populate("activities appointments")
    .select("-password") // Never expose password hash
    .exec();
}

/**
 * Fetch a specific user by ID
 */
export async function getUserById(id: string): Promise<IUser | null> {
  return User.findById(id)
    .populate("activities appointments")
    .select("-password")
    .exec();
}

/**
 * Update user profile (e.g., name, age, etc.)
 * ⚠️ Do NOT allow role or password updates through this function
 */
export async function updateUser(
  id: string,
  updateData: Partial<IUser>
): Promise<IUser | null> {
  // ✅ Remove sensitive fields that shouldn't be updated directly
  const { password, role, ...safeUpdateData } = updateData as any;

  return User.findByIdAndUpdate(id, safeUpdateData, {
    new: true,
    runValidators: true, // ✅ Ensure data validation
  })
    .populate("activities appointments")
    .select("-password")
    .exec();
}

/**
 * Delete user (users can delete their own account)
 */
export async function deleteUser(id: string): Promise<IUser | null> {
  return User.findByIdAndDelete(id)
    .populate("activities appointments")
    .select("-password")
    .exec();
}
