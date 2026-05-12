import { Request, Response } from "express";
import { HttpError } from "../../core/errors/http-error.js";
import { createCitySchema, listCitiesQuerySchema } from "./city.schemas.js";
import { createCity, listCities } from "./city.service.js";

export async function getCities(req: Request, res: Response): Promise<void> {
  const query = listCitiesQuerySchema.parse(req.query);
  const rows = await listCities(query.countryId);
  res.json(rows);
}

export async function postCity(req: Request, res: Response): Promise<void> {
  if (!req.user) throw new HttpError(401, "No autenticado");
  const input = createCitySchema.parse(req.body);
  const row = await createCity(req.user.role, input.name, input.countryId);
  res.status(201).json(row);
}
