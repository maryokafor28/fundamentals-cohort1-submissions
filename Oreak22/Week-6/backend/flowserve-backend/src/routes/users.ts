import { Router } from "express";
import { validateBody, validateQuery } from "../middlewares/validate";
import { createUserSchema, paginationSchema } from "../schemas/userSchemas";
import {
  createUser,
  deleteUser,
  getUser,
  listUsers,
  updateUser,
} from "../controllers/userController";

const router = Router();

router.post("/", validateBody(createUserSchema), createUser);
router.get("/", validateQuery(paginationSchema), listUsers);
router.get("/:id", getUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
