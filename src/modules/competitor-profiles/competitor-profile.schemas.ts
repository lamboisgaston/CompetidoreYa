import { z } from "zod";

export const upsertCompetitorProfileSchema = z.object({
  cityId: z.string().cuid(),
  sportId: z.string().cuid(),
  sportCategoryId: z.string().cuid()
});
