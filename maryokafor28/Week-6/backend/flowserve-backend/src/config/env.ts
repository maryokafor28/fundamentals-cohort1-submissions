import dotenv from "dotenv";
import { z } from "zod";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const envSchema = z.object({
  PORT: z.string().default("4000"),
  DATABASE_URL: z.string().url(),
  NODE_ENV: z.enum(["development", "production"]).default("development"),
});

export const ENV = envSchema.parse(process.env);
