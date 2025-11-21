export class LegacyError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 503) {
    super(message);
    this.name = "LegacyError";
    this.statusCode = statusCode;
  }
}
