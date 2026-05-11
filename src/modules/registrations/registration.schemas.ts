import { z } from "zod";

export const createRegistrationSchema = z.object({
  tournamentId: z.string().cuid()
});
