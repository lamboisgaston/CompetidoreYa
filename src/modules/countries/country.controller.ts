import { Request, Response } from "express";
import { listCountries } from "./country.service.js";

export async function getCountries(_req: Request, res: Response): Promise<void> {
  const rows = await listCountries();
  res.json(rows);
}
