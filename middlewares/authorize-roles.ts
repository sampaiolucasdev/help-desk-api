import type { RequestHandler } from "express";
import { AppError } from "../utils/app-error";

export function authorizeRole(...allowedRoles: string[]): RequestHandler {
  return (req, _res, next) => {
    const request = req as typeof req & { user?: { role: string } };

    if (!request.user) {
      next(new AppError("Autenticação necessária.", 401));
      return;
    }

    if (!allowedRoles.includes(request.user.role)) {
      next(new AppError("Você não tem permissão.", 403));
      return;
    }

    next();
  };
}
