import { AuditAction, Role } from "@prisma/client";
import { prisma } from "../../config/prisma.js";
import { HttpError } from "../../core/errors/http-error.js";
import { registerAudit } from "../audit/audit.service.js";

export async function listTournaments(userId: string, role: Role) {
  if (role === Role.SUPER_ADMIN) return prisma.tournament.findMany();
  if (role === Role.ORGANIZADOR) return prisma.tournament.findMany({ where: { organizerId: userId } });
  throw new HttpError(403, "Solo SUPER_ADMIN u ORGANIZADOR");
}

export async function createTournament(userId: string, role: Role, name: string) {
  if (![Role.SUPER_ADMIN, Role.ORGANIZADOR].includes(role)) throw new HttpError(403, "No autorizado");
  const tournament = await prisma.tournament.create({ data: { name, organizerId: userId } });
  await registerAudit({ userId, action: AuditAction.CREATE_TOURNAMENT, targetId: tournament.id });
  return tournament;
}
