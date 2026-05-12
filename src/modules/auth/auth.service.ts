import { AuditAction } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import { prisma } from "../../config/prisma.js";
import { HttpError } from "../../core/errors/http-error.js";
import { registerAudit } from "../audit/audit.service.js";

export async function registerUser(input: { email: string; password: string; role: any; firstName?: string; lastName?: string; countryId?: string; cityId?: string }) {
  const exists = await prisma.user.findUnique({ where: { email: input.email } });
  if (exists) throw new HttpError(409, "El email ya está en uso");

  const passwordHash = await bcrypt.hash(input.password, env.BCRYPT_SALT_ROUNDS);

  if (input.countryId) {
    const country = await prisma.country.findUnique({ where: { id: input.countryId } });
    if (!country) throw new HttpError(404, "País no encontrado");
  }

  if (input.cityId) {
    const city = await prisma.city.findUnique({ where: { id: input.cityId } });
    if (!city) throw new HttpError(404, "Ciudad no encontrada");
    if (input.countryId && city.countryId !== input.countryId) throw new HttpError(400, "La ciudad no pertenece al país indicado");
  }

  const user = await prisma.user.create({
    data: { email: input.email, passwordHash, role: input.role, firstName: input.firstName, lastName: input.lastName, countryId: input.countryId, cityId: input.cityId },
    select: { id: true, email: true, role: true, createdAt: true }
  });

  return user;
}

export async function loginUser(input: { email: string; password: string }) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) throw new HttpError(401, "Credenciales inválidas");

  const valid = await bcrypt.compare(input.password, user.passwordHash);
  if (!valid) throw new HttpError(401, "Credenciales inválidas");

  const token = jwt.sign({ sub: user.id, role: user.role, email: user.email }, env.JWT_SECRET, { expiresIn: "8h" });
  await registerAudit({ userId: user.id, action: AuditAction.LOGIN, detail: "Inicio de sesión" });

  return { token };
}
