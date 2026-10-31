import { Router } from "express";
import { validateBody } from "../../middlewares/validate-body";
import { loginRateLimit } from "../../middlewares/login-rate-limit";
import { login, register } from "./auth.controller";
import { loginSchema, registerSchema } from "./auth.schemas";

export const authRoutes = Router();

authRoutes.post("/register", validateBody(registerSchema), register);

authRoutes.post("/login", loginRateLimit, validateBody(loginSchema), login);
