import { Role } from "@prisma/client";
import { prisma } from "../../config/prisma.js";
import { HttpError } from "../../core/errors/http-error.js";

export async function listCities(countryId?: string) {
  return prisma.city.findMany({ where: countryId ? { countryId } : undefined, orderBy: { name: "asc" } });
}

export async function createCity(role: Role, name: string, countryId: string) {
  if (role !== Role.SUPER_ADMIN) throw new HttpError(403, "Solo SUPER_ADMIN");
  const country = await prisma.country.findUnique({ where: { id: countryId } });
  if (!country) throw new HttpError(404, "País no encontrado");
  return prisma.city.create({ data: { name, countryId } });
}
