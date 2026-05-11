import { z } from "zod";

export const createSportSchema = z.object({
  name: z.string().trim().min(2).max(100)
});
