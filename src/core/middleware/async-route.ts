import type { RequestHandler } from "express";

// Express 4 no propaga por sí solo el rechazo de un controlador async.
export function asyncRoute(handler: RequestHandler): RequestHandler {
  return (req, res, next) => {
    Promise.resolve().then(() => handler(req, res, next)).catch(next);
  };
}
