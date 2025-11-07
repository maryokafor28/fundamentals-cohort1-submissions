class AppError extends Error {
  constructor(message, statusCode, extra = {}) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    if (extra.errors) this.errors = extra.errors;
    if (extra.meta) this.meta = extra.meta;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
