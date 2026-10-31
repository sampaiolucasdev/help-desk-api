import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate";
import { authorizeRole } from "../../middlewares/authorize-roles";
import { validateBody } from "../../middlewares/validate-body";
import {
  addCommentSchema,
  assignTicketSchema,
  changeStatusSchema,
  createTicketSchema,
} from "./tickets.schemas";
import {
  addComment,
  assignTicket,
  changeTicketStatus,
  createTicket,
  getTicket,
  getTicketHistory,
  listTickets,
} from "./tickets.controller";

export const ticketRoutes = Router();

ticketRoutes.use(authenticate);

ticketRoutes.post("/", validateBody(createTicketSchema), createTicket);

ticketRoutes.get("/", listTickets);

ticketRoutes.get("/:id", getTicket);

ticketRoutes.post(
  "/:id/assign",
  authorizeRole("ADMIN"),
  validateBody(assignTicketSchema),
  assignTicket,
);

ticketRoutes.patch(
  "/:id/status",
  authorizeRole("TECHNICIAN", "ADMIN"),
  validateBody(changeStatusSchema),
  changeTicketStatus,
);

ticketRoutes.post("/:id/comments", validateBody(addCommentSchema), addComment);

ticketRoutes.get("/:id/history", getTicketHistory);
