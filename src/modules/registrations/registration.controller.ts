import { Request, Response } from "express";
import { HttpError } from "../../core/errors/http-error.js";
import { createRegistrationSchema } from "./registration.schemas.js";
import { createRegistration, listOwnRegistrations, listTournamentRegistrations } from "./registration.service.js";

export async function postRegistration(req: Request, res: Response): Promise<void> {
  if (!req.user) throw new HttpError(401, "No autenticado");
  const input = createRegistrationSchema.parse(req.body);
  const row = await createRegistration(req.user.sub, req.user.role, input.tournamentId);
  res.status(201).json(row);
}


export async function getOwnRegistrations(req: Request, res: Response): Promise<void> {
  if (!req.user) throw new HttpError(401, "No autenticado");
  const rows = await listOwnRegistrations(req.user.sub, req.user.role);
  res.status(200).json(rows);
}

export async function getTournamentRegistrations(req: Request, res: Response): Promise<void> {
  if (!req.user) throw new HttpError(401, "No autenticado");
  const { tournamentId } = req.params;
  const rows = await listTournamentRegistrations(req.user.sub, req.user.role, tournamentId);
  res.status(200).json(rows);
}
