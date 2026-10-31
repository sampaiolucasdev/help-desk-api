import "dotenv/config";
import express from "express";
import { authRoutes } from "../modules/auth/auth.routes";
import { ticketRoutes } from "../modules/tickets/tickets.routes";
import { catalogRoutes } from "../modules/catalog/catalog.routes";
import { errorHandler } from "../middlewares/error-handler";

export const app = express();

app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "helpdesk-api",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/catalog", catalogRoutes);

app.use((_req, res) => {
  res.status(404).json({
    error: "Rota não encontrada.",
  });
});

app.use(errorHandler);
