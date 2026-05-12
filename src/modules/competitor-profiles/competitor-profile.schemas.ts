import { z } from "zod";

export const upsertCompetitorProfileSchema = z.object({
  cityId: z.string().cuid(),
  sportId: z.string().cuid().optional(),
  sportCategoryId: z.string().cuid().optional()
});
