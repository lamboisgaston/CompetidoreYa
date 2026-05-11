import { AuditAction, Role } from "@prisma/client";
import { prisma } from "../../config/prisma.js";
import { HttpError } from "../../core/errors/http-error.js";
import { registerAudit } from "../audit/audit.service.js";

export async function createRegistration(userId: string, role: Role, tournamentId: string) {
  if (role !== Role.COMPETIDOR) throw new HttpError(403, "Solo COMPETIDOR puede inscribirse");
  const reg = await prisma.registration.create({ data: { competitorId: userId, tournamentId } });
  await registerAudit({ userId, action: AuditAction.REGISTER_COMPETITOR, targetId: reg.id });
  return reg;
}
