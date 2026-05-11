import { Role } from "@prisma/client";
import { prisma } from "../../config/prisma.js";
import { HttpError } from "../../core/errors/http-error.js";

export async function getOwnCompetitorProfile(userId: string, role: Role) {
  if (role !== Role.COMPETIDOR) throw new HttpError(403, "Solo COMPETIDOR");
  return prisma.competitorProfile.findUnique({
    where: { userId },
    include: { city: true, sport: true, sportCategory: true }
  });
}

export async function upsertCompetitorProfile(userId: string, role: Role, input: { cityId: string; sportId: string; sportCategoryId: string }) {
  if (role !== Role.COMPETIDOR) throw new HttpError(403, "Solo COMPETIDOR");

  const [city, sport, category] = await Promise.all([
    prisma.city.findUnique({ where: { id: input.cityId } }),
    prisma.sport.findUnique({ where: { id: input.sportId } }),
    prisma.sportCategory.findUnique({ where: { id: input.sportCategoryId } })
  ]);

  if (!city) throw new HttpError(404, "Ciudad no encontrada");
  if (!sport) throw new HttpError(404, "Deporte no encontrado");
  if (!category || category.sportId !== sport.id) throw new HttpError(400, "Categoría deportiva inválida");

  return prisma.competitorProfile.upsert({
    where: { userId },
    create: { userId, ...input },
    update: input,
    include: { city: true, sport: true, sportCategory: true }
  });
}
