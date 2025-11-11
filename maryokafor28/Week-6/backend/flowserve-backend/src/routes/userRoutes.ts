import { Router } from "express";
import { userController } from "../controllers/userController";
import { validate } from "../middlewares/validate";
import {
  createUserSchema,
  getUsersSchema,
  getUserByIdSchema,
  updateUserSchema,
  deleteUserSchema,
} from "../validations/userValidation";

const router = Router();

router.post("/", validate(createUserSchema), userController.createUser);
router.get("/", validate(getUsersSchema), userController.getUsers);
router.get("/:id", validate(getUserByIdSchema), userController.getUserById);
router.put("/:id", validate(updateUserSchema), userController.updateUser);
router.delete("/:id", validate(deleteUserSchema), userController.deleteUser);

export default router;
