import { z } from "zod";

const ticketStatuses = [
  "OPEN",
  "IN_PROGRESS",
  "WAITING_FOR_REQUESTER",
  "RESOLVED",
  "CLOSED",
] as const;

const ticketPriorities = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const;

export const createTicketSchema = z.object({
  title: z.string().trim().min(5).max(150),
  description: z.string().trim().min(10).max(5000),
  departmentId: z.string().min(1),
  categoryId: z.string().min(1),
  priority: z.enum(ticketPriorities).default("MEDIUM"),
});

export const assignTicketSchema = z.object({
  technicianId: z.string().min(1),
});

export const changeStatusSchema = z.object({
  status: z.enum(ticketStatuses),
});

export const addCommentSchema = z.object({
  content: z.string().trim().min(1).max(3000),
});
