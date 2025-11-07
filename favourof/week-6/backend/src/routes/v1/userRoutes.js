import express from "express";
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "../../controllers/userController.js";
import { validateRequest } from "../../middlewares/validateRequest.js";
import {
  createUserSchema,
  updateUserSchema,
} from "../../validations/userValidator.js";

const router = express.Router();

router
  .route("/")
  .post(validateRequest(createUserSchema), createUser)
  .get(getUsers);

router
  .route("/:id")
  .get(getUserById)
  .patch(validateRequest(updateUserSchema), updateUser)
  .delete(deleteUser);

export default router;
