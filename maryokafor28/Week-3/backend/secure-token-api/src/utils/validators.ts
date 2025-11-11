// Simple email validation using regex
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
};

// Password validation (min 8 chars, 1 uppercase, 1 lowercase, 1 number)
export const isValidPassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

// Password strength checker (returns weak, medium, strong)
export const getPasswordStrength = (password: string): string => {
  if (password.length < 8) return "weak";

  let strength = 0;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[@$!%*?&#]/.test(password)) strength++;
  if (password.length >= 12) strength++;

  if (strength <= 2) return "weak";
  if (strength <= 3) return "medium";
  return "strong";
};

// Sanitize text inputs (remove HTML tags, dangerous characters)
export const sanitizeInput = (text: string): string => {
  return text
    .replace(/<[^>]*>?/gm, "") // remove HTML tags
    .replace(/[;$]/g, "") // remove $ to prevent NoSQL injection
    .replace(/[{}]/g, "") // remove braces
    .replace(/on\w+\s*=/gi, "") // remove event handlers like onclick=
    .replace(/javascript:/gi, "") // remove javascript: protocol
    .replace(/--/g, "") // remove SQL comment patterns
    .trim()
    .slice(0, 1000); // limit length to prevent DOS attacks
};

// validate role
export const isValidRole = (role: string): boolean => {
  const allowedRoles = ["user", "admin"];
  return allowedRoles.includes(role);
};
export const isValidUsername = (username: string): boolean => {
  const usernameRegex = /^[a-zA-Z0-9._-]{3,20}$/;
  return usernameRegex.test(username.trim());
};

export const sanitizeObjectInput = (obj: any): any => {
  const cleanObj: any = {};
  for (const key in obj) {
    if (typeof obj[key] === "string") {
      cleanObj[key] = sanitizeInput(obj[key]);
    } else if (typeof obj[key] === "object" && obj[key] !== null) {
      cleanObj[key] = sanitizeObjectInput(obj[key]);
    } else {
      cleanObj[key] = obj[key];
    }
  }
  return cleanObj;
};
