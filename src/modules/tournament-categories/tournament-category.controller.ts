import { Request, Response } from "express";
import { HttpError } from "../../core/errors/http-error.js";
import { createTournamentCategorySchema } from "./tournament-category.schemas.js";
import { createTournamentCategory, listTournamentCategories } from "./tournament-category.service.js";

export async function getTournamentCategories(req: Request, res: Response): Promise<void> {
  const tournamentId = typeof req.query.tournamentId === "string" ? req.query.tournamentId : undefined;
  const rows = await listTournamentCategories(tournamentId);
  res.json(rows);
}

export async function postTournamentCategory(req: Request, res: Response): Promise<void> {
  if (!req.user) throw new HttpError(401, "No autenticado");
  const input = createTournamentCategorySchema.parse(req.body);
  const row = await createTournamentCategory(req.user.sub, req.user.role, input);
  res.status(201).json(row);
}
