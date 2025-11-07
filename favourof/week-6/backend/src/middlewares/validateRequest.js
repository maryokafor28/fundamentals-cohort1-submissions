import AppError from "../utils/AppError.js";

export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((err) => ({
        field: err.path.join("."),
        message: err.message.replace(/['"]/g, ""),
      }));

      return next(
        new AppError("Validation failed", 400, {
          errors,
        })
      );
    }

    req.body = value;
    next();
  };
};
