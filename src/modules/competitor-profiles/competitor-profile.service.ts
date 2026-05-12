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

export async function upsertCompetitorProfile(userId: string, role: Role, input: { cityId: string; sportId?: string; sportCategoryId?: string }) {
  if (role !== Role.COMPETIDOR) throw new HttpError(403, "Solo COMPETIDOR");

  const [city, sport, category] = await Promise.all([
    prisma.city.findUnique({ where: { id: input.cityId } }),
    input.sportId ? prisma.sport.findUnique({ where: { id: input.sportId } }) : Promise.resolve(null),
    input.sportCategoryId ? prisma.sportCategory.findUnique({ where: { id: input.sportCategoryId } }) : Promise.resolve(null)
  ]);

  if (!city) throw new HttpError(404, "Ciudad no encontrada");
  if (input.sportId && !sport) throw new HttpError(404, "Deporte no encontrado");
  if (input.sportCategoryId && !category) throw new HttpError(404, "Categoría deportiva no encontrada");
  if ((input.sportId && !input.sportCategoryId) || (!input.sportId && input.sportCategoryId)) {
    throw new HttpError(400, "Deporte y categoría deben enviarse juntos");
  }
  if (sport && category && category.sportId !== sport.id) throw new HttpError(400, "Categoría deportiva inválida");

  return prisma.competitorProfile.upsert({
    where: { userId },
    create: { userId, ...input },
    update: input,
    include: { city: true, sport: true, sportCategory: true }
  });
}
