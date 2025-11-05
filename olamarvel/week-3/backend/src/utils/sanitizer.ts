export const validateEmail = (email: string): string | null => {
  if (!email) return null;

  const clean = email.trim().toLowerCase();
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return regex.test(clean) ? clean : null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) return null;

  const clean = password.trim();
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  return regex.test(clean) ? clean : null;
};

import { Types } from "mongoose";

export function validateTaskInput(body: any): { ok: boolean; errors?: string[]; data?: { title: string; description: string; metadata?: any } } {
  const errors: string[] = [];
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const description = typeof body.description === "string" ? body.description.trim() : "";

  if (!title || title.length < 1) errors.push("Title is required");
  if (title.length > 150) errors.push("Title is too long (max 150)");
  if (description.length > 2000) errors.push("Description is too long (max 2000)");

  if (errors.length) return { ok: false, errors };
  return { ok: true, data: { title, description, metadata: body.metadata } };
}

export function validatePagination(params: any): { page: number; perPage: number } {
  const page = Math.max(1, parseInt((params?.page as any) || "1", 10) || 1);
  let perPage = Math.max(1, parseInt((params?.perPage as any) || "10", 10) || 10);
  if (perPage > 100) perPage = 100;
  return { page, perPage };
}

export function isValidObjectId(id: any): boolean {
  if (!id) return false;
  return Types.ObjectId.isValid(String(id));
}

export function sanitizeText(input: any): string {
  if (input === undefined || input === null) return "";
  const s = String(input).trim();
  // Basic sanitization: strip angle brackets and control chars that often cause issues
  return s.replace(/[<>]/g, "").replace(/[\x00-\x1F\x7F]/g, "");
}

export function whitelistSortField(field: any): string {
  const allowed = ["createdAt", "updatedAt", "title"];
  const f = String(field || "");
  return allowed.includes(f) ? f : "createdAt";
}
