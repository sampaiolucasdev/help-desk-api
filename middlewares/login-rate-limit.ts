import { rateLimit } from "express-rate-limit";

export const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  limit: 5, // 5 tentativas por IP a cada janela
  standardHeaders: "draft-8",
  legacyHeaders: false, // Desabilita o `X-RateLimit-*` headers
  message: "Muitas tentativas de login. Por favor, tente novamente mais tarde.",
});
