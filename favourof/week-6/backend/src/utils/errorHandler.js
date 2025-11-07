import logger from "../utils/logger.js";

export const errorHandler = (err, req, res, next) => {
  console.error("💥 Error:", err);

  // Prisma unique constraint violation (e.g., duplicate email)
  if (err.code === "P2002") {
    const target = err.meta?.target?.join(", ");
    return res.status(400).json({
      status: "fail",
      message: `${target} already exists.`,
    });
  }

  // Prisma record not found
  if (err.code === "P2025") {
    return res.status(404).json({
      status: "fail",
      message: "Record not found",
    });
  }

  // Prisma validation error
  if (err.code === "P2009" || err.code === "P2010") {
    return res.status(400).json({
      status: "fail",
      message: "Invalid data provided",
    });
  }

  // Default / Custom errors
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Log error safely (no sensitive data)
  logger.error(`${statusCode} - ${message}`);

  // Build response object dynamically
  const response = {
    status: err.status || "error",
    message,
  };

  // Include structured validation errors if available
  if (err.errors) response.errors = err.errors;

  // Include any extra meta info (optional)
  if (err.meta) response.meta = err.meta;

  res.status(statusCode).json(response);
};
