import { randomUUID } from "crypto";

export const generateId = (): string => {
  return randomUUID();
};
