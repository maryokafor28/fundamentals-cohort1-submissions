import Joi from "joi";

export const createCommentSchema = Joi.object({
  text: Joi.string().min(3).max(500).required().messages({
    "string.empty": "Comment cannot be empty",
    "string.min": "Comment must be at least 3 characters",
    "string.max": "Comment cannot exceed 500 characters",
  }),
});
