import { Request, Response } from "express";
import { Role } from "@prisma/client";
import { loginSchema, registerCompetitorSchema, registerOrganizerSchema, registerRefereeSchema, registerSchema } from "./auth.schemas.js";
import { loginUser, registerUser } from "./auth.service.js";

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

export async function registerCompetitor(req: Request, res: Response): Promise<void> {
  const input = registerCompetitorSchema.parse(req.body);
  const user = await registerUser({ ...input, role: Role.COMPETIDOR });
  res.status(201).json(user);
}


export async function registerOrganizer(req: Request, res: Response): Promise<void> {
  const input = registerOrganizerSchema.parse(req.body);
  const user = await registerUser({ ...input, role: Role.ORGANIZADOR });
  res.status(201).json(user);
}

export async function registerReferee(req: Request, res: Response): Promise<void> {
  const input = registerRefereeSchema.parse(req.body);
  const user = await registerUser({ ...input, role: Role.ARBITRO });
  res.status(201).json(user);
}
