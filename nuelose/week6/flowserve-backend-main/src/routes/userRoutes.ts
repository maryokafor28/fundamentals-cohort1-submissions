import { Router } from "express";
import { createUser, deleteUser, getUserById, listUsers, updateUser } from "../controllers/user.controller";
import { validate } from "../middlewares/validate";
import { createUserSchema, userIdSchema, updateUserSchema, userQuerySchema } from "../schemas/user.schema";

const router = Router();

router.get("/", validate(userQuerySchema), listUsers);
router.post("/", validate(createUserSchema), createUser);
router.get("/:id", validate(userIdSchema), getUserById);
router.patch("/:id", validate(updateUserSchema), updateUser);
router.delete("/:id", validate(userIdSchema), deleteUser)


export default router;
