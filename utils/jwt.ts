import jwt from "jsonwebtoken";

interface TokenPayload {
  sub: string;
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET não configurado ou muito curto.");
  }

  return secret;
}

export function generateToken(userId: string): string {
  const expiresIn = process.env.JWT_EXPIRES_IN ?? "1h";

  return jwt.sign({ sub: userId } satisfies TokenPayload, getJwtSecret(), {
    expiresIn: expiresIn as jwt.SignOptions["expiresIn"],
  });
}

export function verifyToken(token: string): TokenPayload {
  const decoded = jwt.verify(token, getJwtSecret());

  if (typeof decoded === "string" || typeof decoded.sub !== "string") {
    throw new Error("Token inválido.");
  }

  return { sub: decoded.sub };
}
