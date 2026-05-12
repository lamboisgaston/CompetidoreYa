import { prisma } from "../../config/prisma.js";

export async function listCountries() {
  return prisma.country.findMany({ orderBy: { name: "asc" } });
}
