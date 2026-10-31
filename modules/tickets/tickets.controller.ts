import type { RequestHandler } from "express";
import type { TicketStatus } from "@prisma/client";
import * as ticketsService from "./tickets.service";
import { AppError } from "../../utils/app-error";

function getActor(req: Parameters<RequestHandler>[0]) {
  if (!req.user) {
    throw new AppError("Autenticação necessária.", 401);
  }

  return req.user;
}

function getTicketId(req: Parameters<RequestHandler>[0]) {
  const id = req.params.id;

  if (typeof id !== "string") {
    throw new AppError("Identificador inválido.", 400);
  }

  return id;
}

export const createTicket: RequestHandler = async (req, res, next) => {
  try {
    const ticket = await ticketsService.createTicket(req.body, getActor(req));

    res.status(201).json({ ticket });
  } catch (error) {
    next(error);
  }
};

export const listTickets: RequestHandler = async (req, res, next) => {
  try {
    const tickets = await ticketsService.listTickets(getActor(req));
    res.json({ tickets });
  } catch (error) {
    next(error);
  }
};

export const getTicket: RequestHandler = async (req, res, next) => {
  try {
    const ticket = await ticketsService.getTicket(
      getTicketId(req),
      getActor(req),
    );

    res.json({ ticket });
  } catch (error) {
    next(error);
  }
};

export const assignTicket: RequestHandler = async (req, res, next) => {
  try {
    const ticket = await ticketsService.assignTicket(
      getTicketId(req),
      req.body.technicianId,
      getActor(req),
    );

    res.json({ ticket });
  } catch (error) {
    next(error);
  }
};

export const changeTicketStatus: RequestHandler = async (req, res, next) => {
  try {
    const ticket = await ticketsService.changeTicketStatus(
      getTicketId(req),
      req.body.status as TicketStatus,
      getActor(req),
    );

    res.json({ ticket });
  } catch (error) {
    next(error);
  }
};

export const addComment: RequestHandler = async (req, res, next) => {
  try {
    const comment = await ticketsService.addComment(
      getTicketId(req),
      req.body.content,
      getActor(req),
    );

    res.status(201).json({ comment });
  } catch (error) {
    next(error);
  }
};

export const getTicketHistory: RequestHandler = async (req, res, next) => {
  try {
    const history = await ticketsService.getTicketHistory(
      getTicketId(req),
      getActor(req),
    );

    res.json({ history });
  } catch (error) {
    next(error);
  }
};
