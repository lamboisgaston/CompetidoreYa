import { Role } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { HttpError } from "../errors/http-error.js";

export function requireRole(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) throw new HttpError(401, "No autenticado");
    if (!roles.includes(req.user.role)) {
      throw new HttpError(403, "No autorizado para esta acción");
    }
    next();
  };
}
