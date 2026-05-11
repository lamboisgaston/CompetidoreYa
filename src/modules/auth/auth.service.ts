import { AuditAction } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import { prisma } from "../../config/prisma.js";
import { HttpError } from "../../core/errors/http-error.js";
import { registerAudit } from "../audit/audit.service.js";

export async function registerUser(input: { email: string; password: string; role: any }) {
  const exists = await prisma.user.findUnique({ where: { email: input.email } });
  if (exists) throw new HttpError(409, "El email ya está en uso");

  const passwordHash = await bcrypt.hash(input.password, env.BCRYPT_SALT_ROUNDS);
  const user = await prisma.user.create({
    data: { email: input.email, passwordHash, role: input.role },
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
