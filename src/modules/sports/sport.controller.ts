import { Request, Response } from "express";
import { HttpError } from "../../core/errors/http-error.js";
import { createSportSchema } from "./sport.schemas.js";
import { createSport, listSports } from "./sport.service.js";

export async function getSports(_req: Request, res: Response): Promise<void> {
  const rows = await listSports();
  res.json(rows);
}

export async function postSport(req: Request, res: Response): Promise<void> {
  if (!req.user) throw new HttpError(401, "No autenticado");
  const input = createSportSchema.parse(req.body);
  const row = await createSport(req.user.role, input.name);
  res.status(201).json(row);
}
