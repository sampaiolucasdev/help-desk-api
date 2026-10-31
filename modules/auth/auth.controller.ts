import type { RequestHandler } from "express";
import { loginUser, registerUser } from "./auth.service";

export const register: RequestHandler = async (req, res, next) => {
  try {
    const user = await registerUser(req.body);

    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
};

export const login: RequestHandler = async (req, res, next) => {
  try {
    const result = await loginUser(req.body);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
