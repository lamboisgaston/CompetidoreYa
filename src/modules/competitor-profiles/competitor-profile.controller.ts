import { Request, Response } from "express";
import { HttpError } from "../../core/errors/http-error.js";
import { upsertCompetitorProfileSchema } from "./competitor-profile.schemas.js";
import { getOwnCompetitorProfile, upsertCompetitorProfile } from "./competitor-profile.service.js";

export async function getCompetitorProfile(req: Request, res: Response): Promise<void> {
  if (!req.user) throw new HttpError(401, "No autenticado");
  const row = await getOwnCompetitorProfile(req.user.sub, req.user.role);
  res.json(row);
}

export async function putCompetitorProfile(req: Request, res: Response): Promise<void> {
  if (!req.user) throw new HttpError(401, "No autenticado");
  const input = upsertCompetitorProfileSchema.parse(req.body);
  const row = await upsertCompetitorProfile(req.user.sub, req.user.role, input);
  res.status(200).json(row);
}
