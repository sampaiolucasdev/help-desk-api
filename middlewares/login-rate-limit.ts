import { rateLimit } from 'express-rate-limit';

export const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false, // Desabilita o `X-RateLimit-*` headers
  max: 5, // Limite 5 logins por IP a cada `window` (aqui, por 15 minutos)
  message: 'Muitas tentativas de login. Por favor, tente novamente mais tarde.',
})