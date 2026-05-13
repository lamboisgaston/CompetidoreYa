import { Role } from "@prisma/client";
import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(10),
  role: z.nativeEnum(Role)
});

export const publicRoleRegistrationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(10),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  countryId: z.string().cuid(),
  cityId: z.string().cuid()
});

export const registerCompetitorSchema = publicRoleRegistrationSchema;
export const registerOrganizerSchema = publicRoleRegistrationSchema;
export const registerRefereeSchema = publicRoleRegistrationSchema;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});
