import { z } from "zod";

export const createTournamentCategorySchema = z.object({
  tournamentId: z.string().cuid(),
  sportId: z.string().cuid(),
  sportCategoryId: z.string().cuid()
});
