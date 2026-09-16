import { HttpError } from "../../core/errors/http-error.js";

export const PUBLIC_REGISTRATION_ROLES = ["COMPETIDOR", "ORGANIZADOR", "ARBITRO"] as const;
export type PublicRegistrationRole = typeof PUBLIC_REGISTRATION_ROLES[number];

export function requirePublicRegistrationRole(value: unknown): asserts value is PublicRegistrationRole {
  if (!(PUBLIC_REGISTRATION_ROLES as readonly unknown[]).includes(value)) {
    throw new HttpError(403, "El rol solicitado no admite registro público");
  }
}
