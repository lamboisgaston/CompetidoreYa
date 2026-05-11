import { Role } from "@prisma/client";
import { prisma } from "../../config/prisma.js";
import { HttpError } from "../../core/errors/http-error.js";

export async function listTournamentCategories(tournamentId?: string) {
  return prisma.tournamentCategory.findMany({
    where: tournamentId ? { tournamentId } : undefined,
    include: { sport: true, sportCategory: true },
    orderBy: { createdAt: "desc" }
  });
}

export async function createTournamentCategory(userId: string, role: Role, data: { tournamentId: string; sportId: string; sportCategoryId: string }) {
  if (role !== Role.SUPER_ADMIN && role !== Role.ORGANIZADOR) throw new HttpError(403, "No autorizado");
  const tournament = await prisma.tournament.findUnique({ where: { id: data.tournamentId } });
  if (!tournament) throw new HttpError(404, "Torneo no encontrado");
  if (role === Role.ORGANIZADOR && tournament.organizerId !== userId) throw new HttpError(403, "Solo tu propio torneo");

  const category = await prisma.sportCategory.findUnique({ where: { id: data.sportCategoryId } });
  if (!category || category.sportId !== data.sportId) throw new HttpError(400, "Categoría deportiva inválida");

  return prisma.tournamentCategory.create({ data });
}
