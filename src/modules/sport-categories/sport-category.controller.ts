import { Request, Response } from "express";
import { HttpError } from "../../core/errors/http-error.js";
import { createSportCategorySchema } from "./sport-category.schemas.js";
import { createSportCategory, listSportCategories } from "./sport-category.service.js";

export async function getSportCategories(req: Request, res: Response): Promise<void> {
  const sportId = typeof req.query.sportId === "string" ? req.query.sportId : undefined;
  const rows = await listSportCategories(sportId);
  res.json(rows);
}

export async function postSportCategory(req: Request, res: Response): Promise<void> {
  if (!req.user) throw new HttpError(401, "No autenticado");
  const input = createSportCategorySchema.parse(req.body);
  const row = await createSportCategory(req.user.role, input.sportId, input.name);
  res.status(201).json(row);
}
