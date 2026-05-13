import { Request, Response } from "express";
import { HttpError } from "../../core/errors/http-error.js";
import { createTournamentSchema } from "./tournament.schemas.js";
import { createTournament, listTournaments } from "./tournament.service.js";

export async function getTournaments(req: Request, res: Response): Promise<void> {
  if (!req.user) throw new HttpError(401, "No autenticado");
  const rows = await listTournaments(req.user.sub, req.user.role);
  res.json(rows);
}

export async function postTournament(req: Request, res: Response): Promise<void> {
  if (!req.user) throw new HttpError(401, "No autenticado");
  const input = createTournamentSchema.parse(req.body);
  const row = await createTournament(req.user.sub, req.user.role, input);
  res.status(201).json(row);
}
