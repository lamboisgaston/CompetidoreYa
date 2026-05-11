import { AuditAction, Role } from "@prisma/client";
import { prisma } from "../../config/prisma.js";
import { HttpError } from "../../core/errors/http-error.js";
import { registerAudit } from "../audit/audit.service.js";

export async function createRegistration(userId: string, role: Role, tournamentId: string) {
  if (role !== Role.COMPETIDOR) throw new HttpError(403, "Solo COMPETIDOR puede inscribirse");

  const tournament = await prisma.tournament.findUnique({ where: { id: tournamentId } });
  if (!tournament) throw new HttpError(404, "Torneo no encontrado");

  const profile = await prisma.competitorProfile.findUnique({ where: { userId } });
  if (!profile) throw new HttpError(400, "Debes crear tu perfil deportivo antes de inscribirte");

  const existing = await prisma.registration.findUnique({
    where: { competitorId_tournamentId: { competitorId: userId, tournamentId } }
  });

  if (existing) throw new HttpError(409, "Ya estás inscripto en este torneo");

  const reg = await prisma.registration.create({ data: { competitorId: userId, tournamentId } });
  await registerAudit({ userId, action: AuditAction.REGISTER_COMPETITOR, targetId: reg.id });
  return reg;
}

export async function listOwnRegistrations(userId: string, role: Role) {
  if (role !== Role.COMPETIDOR) throw new HttpError(403, "Solo COMPETIDOR");

  return prisma.registration.findMany({
    where: { competitorId: userId },
    orderBy: { createdAt: "desc" },
    include: {
      tournament: true
    }
  });
}

export async function listTournamentRegistrations(userId: string, role: Role, tournamentId: string) {
  if (role !== Role.SUPER_ADMIN && role !== Role.ORGANIZADOR) {
    throw new HttpError(403, "Solo SUPER_ADMIN u ORGANIZADOR");
  }

  const tournament = await prisma.tournament.findUnique({ where: { id: tournamentId } });
  if (!tournament) throw new HttpError(404, "Torneo no encontrado");

  if (role === Role.ORGANIZADOR && tournament.organizerId !== userId) {
    throw new HttpError(403, "No puedes ver inscripciones de torneos de otro organizador");
  }

  return prisma.registration.findMany({
    where: { tournamentId },
    orderBy: { createdAt: "asc" },
    include: {
      competitor: {
        select: {
          id: true,
          email: true,
          competitorProfile: {
            include: { city: true, sport: true, sportCategory: true }
          }
        }
      }
    }
  });
}
