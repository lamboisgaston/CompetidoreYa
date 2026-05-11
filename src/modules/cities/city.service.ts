import { Role } from "@prisma/client";
import { prisma } from "../../config/prisma.js";
import { HttpError } from "../../core/errors/http-error.js";

export async function listCities() {
  return prisma.city.findMany({ orderBy: { name: "asc" } });
}

export async function createCity(role: Role, name: string) {
  if (role !== Role.SUPER_ADMIN) throw new HttpError(403, "Solo SUPER_ADMIN");
  return prisma.city.create({ data: { name } });
}
