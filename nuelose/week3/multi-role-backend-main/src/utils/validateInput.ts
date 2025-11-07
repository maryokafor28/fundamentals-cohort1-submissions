export interface RegistrationInput {
  email: string;
  password: string;
  role: string;
}

export function sanitizeInput(input: string) {
  if (typeof input !== "string") return "";

  return input
    .replace(/<script.*?>.*?<\/script>/gi, "")
    .replace(/[<>]/g, "")
    .trim();
}

export function validateRegistration({
  email,
  password,
  role,
}: RegistrationInput): string[] {
  const errors: string[] = [];

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !emailRegex.test(email)) {
    errors.push("Invalid email format.");
  }

  if (!password || password.length < 6) {
    errors.push("Password must be at least 6 characters long.");
  }

  const allowedRoles = ["user", "admin"];
  if (!allowedRoles.includes(role)) {
    errors.push("Role must be 'user' or 'admin'.");
  }

  return errors;
}
