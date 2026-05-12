import { z } from "zod";

export const createCitySchema = z.object({
  name: z.string().trim().min(2).max(100),
  countryId: z.string().cuid()
});

export const listCitiesQuerySchema = z.object({
  countryId: z.string().cuid().optional()
});
