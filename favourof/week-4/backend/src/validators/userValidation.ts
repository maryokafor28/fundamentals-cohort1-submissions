import Joi from "joi";

//  Register User
export const registerUserValidation = Joi.object({
  name: Joi.string().trim().min(2).max(50).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 2 characters long",
    "string.max": "Name cannot exceed 50 characters",
  }),

  email: Joi.string()
    .trim()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Please provide a valid email address",
    }),

  password: Joi.string().min(6).max(50).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters long",
  }),

  bio: Joi.string().trim().min(10).max(200).optional().messages({
    "string.min": "Bio must be at least 10 characters long",
    "string.max": "Bio cannot exceed 200 characters",
  }),

  skills: Joi.array()
    .items(Joi.string().trim().lowercase())
    .max(10)
    .optional()
    .messages({
      "array.max": "You can only include up to 10 skills",
    }),

  LinkedIn: Joi.string()
    .uri()
    .pattern(/^https:\/\/(www\.)?linkedin\.com\/.*$/)
    .optional()
    .messages({
      "string.pattern.base": "Please enter a valid LinkedIn profile URL",
    }),

  github: Joi.string()
    .uri()
    .pattern(/^https:\/\/(www\.)?github\.com\/[A-Za-z0-9_-]+$/)
    .optional()
    .messages({
      "string.pattern.base": "Please enter a valid GitHub profile URL",
    }),
});

//  Login User
export const loginUserValidation = Joi.object({
  email: Joi.string()
    .trim()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Please provide a valid email address",
    }),

  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters long",
  }),
});

//  Update User Profile
export const updateUserValidation = Joi.object({
  name: Joi.string().trim().min(2).max(50).optional(),
  bio: Joi.string().trim().min(10).max(200).optional(),
  skills: Joi.array().items(Joi.string().trim().lowercase()).max(10).optional(),
  LinkedIn: Joi.string()
    .uri()
    .pattern(/^https:\/\/(www\.)?linkedin\.com\/.*$/)
    .optional(),
  github: Joi.string()
    .uri()
    .pattern(/^https:\/\/(www\.)?github\.com\/[A-Za-z0-9_-]+$/)
    .optional(),
});
