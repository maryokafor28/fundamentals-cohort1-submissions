import express from "express";

import { authenticate } from "../middlewares/auth.middleware";
import {
  getOneProject,
  getProject,
  newComment,
  newProject,
  search,
  viewProfie,
} from "../controllers/project.Controller";

const router = express.Router();

router.get("/view/:userName", viewProfie);
router.get("/getProject", authenticate, getProject);
router.post("/new", authenticate, newProject);
router.post("/newComment", authenticate, newComment);
router.get("/getComments", authenticate, getProject);
router.get("/:id", authenticate, getOneProject);
router.post("/search", authenticate, search);

export default router;
