import { AuditAction, Role } from "@prisma/client";
import { prisma } from "../../config/prisma.js";
import { HttpError } from "../../core/errors/http-error.js";
import { registerAudit } from "../audit/audit.service.js";

export async function reportResult(userId: string, role: Role, matchId: string, result: string) {
  if (role !== Role.ARBITRO) throw new HttpError(403, "Solo ARBITRO puede cargar resultados");
  const match = await prisma.match.findUnique({ where: { id: matchId } });
  if (!match) throw new HttpError(404, "Partido no encontrado");
  if (match.refereeId !== userId) throw new HttpError(403, "Partido no asignado a este árbitro");

  const updated = await prisma.match.update({ where: { id: matchId }, data: { result, playedAt: new Date() } });
  await registerAudit({ userId, action: AuditAction.REPORT_MATCH_RESULT, targetId: updated.id });
  return updated;
}
