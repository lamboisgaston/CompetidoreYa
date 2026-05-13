import { z } from "zod";

export const createTournamentSchema = z.object({
  name: z.string().min(3).max(120),
  sportId: z.string().cuid(),
  cityId: z.string().cuid(),
  slots: z.number().int().positive().max(5000),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  categoryIds: z.array(z.string().cuid()).min(1)
}).refine((v) => v.endDate >= v.startDate, { message: "La fecha fin debe ser posterior o igual al inicio", path: ["endDate"] });
