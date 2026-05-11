import { Role } from "@prisma/client";
import { prisma } from "../../config/prisma.js";
import { HttpError } from "../../core/errors/http-error.js";

export async function listSportCategories(sportId?: string) {
  return prisma.sportCategory.findMany({
    where: sportId ? { sportId } : undefined,
    orderBy: [{ sportId: "asc" }, { name: "asc" }]
  });
}

export async function createSportCategory(role: Role, sportId: string, name: string) {
  if (role !== Role.SUPER_ADMIN) throw new HttpError(403, "Solo SUPER_ADMIN");
  const sport = await prisma.sport.findUnique({ where: { id: sportId } });
  if (!sport) throw new HttpError(404, "Deporte no encontrado");
  return prisma.sportCategory.create({ data: { sportId, name } });
}
