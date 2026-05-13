import { AuditAction, Role } from "@prisma/client";
import { prisma } from "../../config/prisma.js";
import { HttpError } from "../../core/errors/http-error.js";
import { registerAudit } from "../audit/audit.service.js";

export async function listTournaments(userId: string, role: Role) {
  if (role === Role.SUPER_ADMIN) return prisma.tournament.findMany({ include: { city: true, tournamentCategories: { include: { sportCategory: true, sport: true } }, registrations: true } });
  if (role === Role.ORGANIZADOR) return prisma.tournament.findMany({ where: { organizerId: userId }, include: { city: true, tournamentCategories: { include: { sportCategory: true, sport: true } }, registrations: { include: { competitor: { select: { id: true, email: true, firstName: true, lastName: true } } } } } });
  return prisma.tournament.findMany({ include: { city: true, tournamentCategories: { include: { sportCategory: true, sport: true } } } });
}

export async function createTournament(userId: string, role: Role, input: { name: string; sportId: string; cityId: string; slots: number; startDate: Date; endDate: Date; categoryIds: string[] }) {
  if (role !== Role.SUPER_ADMIN && role !== Role.ORGANIZADOR) throw new HttpError(403, "No autorizado");
  const tournament = await prisma.tournament.create({
    data: {
      name: input.name,
      organizerId: userId,
      cityId: input.cityId,
      slots: input.slots,
      startDate: input.startDate,
      endDate: input.endDate,
      tournamentCategories: { create: input.categoryIds.map((sportCategoryId) => ({ sportId: input.sportId, sportCategoryId })) }
    },
    include: { tournamentCategories: true }
  });
  await registerAudit({ userId, action: AuditAction.CREATE_TOURNAMENT, targetId: tournament.id });
  return tournament;
}
