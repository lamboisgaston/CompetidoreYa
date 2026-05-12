import { Role } from "@prisma/client";
import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(10),
  role: z.nativeEnum(Role)
});

export const registerCompetitorSchema = z.object({
  email: z.string().email(),
  password: z.string().min(10),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  cityId: z.string().cuid()
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});
