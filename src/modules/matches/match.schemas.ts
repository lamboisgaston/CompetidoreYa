import { z } from "zod";

export const reportResultSchema = z.object({
  result: z.string().min(1).max(255)
});
