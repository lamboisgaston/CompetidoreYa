import { Request, Response } from "express";
import { loginSchema, registerCompetitorSchema, registerSchema } from "./auth.schemas.js";
import { loginUser, registerCompetitor, registerUser } from "./auth.service.js";

export async function register(req: Request, res: Response): Promise<void> {
  const input = registerSchema.parse(req.body);
  const user = await registerUser(input);
  res.status(201).json(user);
}

export async function login(req: Request, res: Response): Promise<void> {
  const input = loginSchema.parse(req.body);
  const output = await loginUser(input);
  res.status(200).json(output);
}


export async function registerAsCompetitor(req: Request, res: Response): Promise<void> {
  const input = registerCompetitorSchema.parse(req.body);
  const user = await registerCompetitor(input);
  res.status(201).json(user);
}
