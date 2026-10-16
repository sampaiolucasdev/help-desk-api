import type { Request, Response, NextFunction } from "express";

import { prisma } from "../lib/prisma";
import { AppError } from "../utils/app-error";
import { verifyToken } from "../utils/jwt";

export async function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      throw new AppError("Token de autenticação não informado.", 401);
    }

    const [scheme, token] = authorization.split(" ");

    if (scheme !== "Bearer" || !token) {
      throw new AppError("Formato do token inválido.", 401);
    }

    let payload: { sub: string };

    try {
      payload = verifyToken(token);
    } catch {
      throw new AppError("Token inválido ou expirado.", 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        role: true,
        departmentId: true,
        active: true,
      },
    });

    if (!user || !user.active) {
      throw new AppError("Usuário inexistente ou inativo.", 401);
    }

    req.user = {
      id: user.id,
      role: user.role,
      departmentId: user.departmentId,
    };

    next();
  } catch (error) {
    next(error);
  }
}
