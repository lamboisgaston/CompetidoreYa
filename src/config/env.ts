import { config } from "dotenv";
import { z } from "zod";

config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(32, "JWT_SECRET debe tener al menos 32 caracteres"),
  PORT: z.coerce.number().int().positive().default(3000),
  BCRYPT_SALT_ROUNDS: z.coerce.number().int().min(10).max(14).default(12)
});

export const env = envSchema.parse(process.env);
