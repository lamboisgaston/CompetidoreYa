import { z } from "zod";

export const createSportCategorySchema = z.object({
  sportId: z.string().cuid(),
  name: z.string().trim().min(2).max(100)
});
