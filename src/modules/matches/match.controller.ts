import { Request, Response } from "express";
import { HttpError } from "../../core/errors/http-error.js";
import { reportResultSchema } from "./match.schemas.js";
import { listAssignedMatches, reportResult } from "./match.service.js";

export async function patchMatchResult(req: Request, res: Response): Promise<void> {
  if (!req.user) throw new HttpError(401, "No autenticado");
  const input = reportResultSchema.parse(req.body);
  const row = await reportResult(req.user.sub, req.user.role, req.params.matchId, input.result);
  res.json(row);
}


export async function getAssignedMatches(req: Request, res: Response): Promise<void> {
  if (!req.user) throw new HttpError(401, "No autenticado");
  const rows = await listAssignedMatches(req.user.sub, req.user.role);
  res.json(rows);
}
