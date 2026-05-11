import { z } from "zod";

export const createTournamentSchema = z.object({
  name: z.string().min(3).max(120)
});
