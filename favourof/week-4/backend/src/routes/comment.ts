import express from "express";
import {
  createComment,
  getCommentsForProject,
  updateComment,
  deleteComment,
} from "../controllers/commentController";
import { verifyAccessToken } from "../middlewares/verifyAccessToken";
import validateRequest from "../middlewares/validateRequest";
import { createCommentSchema } from "../validators/commentValidator";

const router = express.Router();

router
  .route("/:projectId")
  .post(verifyAccessToken, validateRequest(createCommentSchema), createComment)
  .get(getCommentsForProject);

router
  .route("/comments/:id")
  .patch(verifyAccessToken, validateRequest(createCommentSchema), updateComment)
  .delete(verifyAccessToken, deleteComment);

export default router;
