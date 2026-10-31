import { Prisma, type TicketStatus, type UserRole } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/app-error";

type Actor = {
  id: string;
  role: UserRole;
  departmentId: string | null;
};

const ticketDetails = {
  requester: {
    select: { id: true, name: true, email: true },
  },
  technician: {
    select: { id: true, name: true, email: true },
  },
  department: true,
  category: true,
} satisfies Prisma.TicketInclude;

async function ensureCanAccessTicket(ticketId: string, actor: Actor) {
  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    include: ticketDetails,
  });

  if (!ticket) {
    throw new AppError("Chamado não encontrado.", 404);
  }

  if (actor.role === "ADMIN") {
    return ticket;
  }

  if (actor.role === "REQUESTER" && ticket.requesterId === actor.id) {
    return ticket;
  }

  if (
    actor.role === "TECHNICIAN" &&
    (ticket.technicianId === actor.id ||
      (ticket.technicianId === null &&
        actor.departmentId !== null &&
        ticket.departmentId === actor.departmentId))
  ) {
    return ticket;
  }

  throw new AppError("Você não tem acesso a este chamado.", 403);
}

export async function createTicket(
  data: {
    title: string;
    description: string;
    departmentId: string;
    categoryId: string;
    priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  },
  actor: Actor,
) {
  const category = await prisma.category.findUnique({
    where: { id: data.categoryId },
  });

  if (!category || category.departmentId !== data.departmentId) {
    throw new AppError(
      "A categoria não pertence ao departamento informado.",
      400,
    );
  }

  const department = await prisma.department.findUnique({
    where: { id: data.departmentId },
  });

  if (!department) {
    throw new AppError("Departamento não encontrado.", 404);
  }

  return prisma.ticket.create({
    data: {
      title: data.title,
      description: data.description,
      priority: data.priority,
      requesterId: actor.id,
      departmentId: data.departmentId,
      categoryId: data.categoryId,
      history: {
        create: {
          actorId: actor.id,
          action: "TICKET_CREATED",
          details: "Chamado criado.",
        },
      },
    },
    include: ticketDetails,
  });
}

export async function listTickets(actor: Actor) {
  const where: Prisma.TicketWhereInput = {};

  if (actor.role === "REQUESTER") {
    where.requesterId = actor.id;
  } else if (actor.role === "TECHNICIAN") {
    where.OR = [
      { technicianId: actor.id },
      ...(actor.departmentId
        ? [
            {
              technicianId: null,
              departmentId: actor.departmentId,
            },
          ]
        : []),
    ];
  }

  return prisma.ticket.findMany({
    where,
    include: ticketDetails,
    orderBy: { createdAt: "desc" },
  });
}

export async function getTicket(ticketId: string, actor: Actor) {
  return ensureCanAccessTicket(ticketId, actor);
}

export async function assignTicket(
  ticketId: string,
  technicianId: string,
  actor: Actor,
) {
  if (actor.role !== "ADMIN") {
    throw new AppError("Somente administradores podem atribuir chamados.", 403);
  }

  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
  });

  if (!ticket) {
    throw new AppError("Chamado não encontrado.", 404);
  }

  const technician = await prisma.user.findUnique({
    where: { id: technicianId },
  });

  if (!technician || !technician.isActive || technician.role !== "TECHNICIAN") {
    throw new AppError("Técnico inválido ou inativo.", 400);
  }

  if (technician.departmentId !== ticket.departmentId) {
    throw new AppError(
      "O técnico não pertence ao departamento do chamado.",
      400,
    );
  }

  return prisma.ticket.update({
    where: { id: ticketId },
    data: {
      technicianId,
      history: {
        create: {
          actorId: actor.id,
          action: "TICKET_ASSIGNED",
          details: `Chamado atribuído ao técnico ${technician.name}.`,
        },
      },
    },
    include: ticketDetails,
  });
}

const allowedTransitions: Record<TicketStatus, TicketStatus[]> = {
  OPEN: ["IN_PROGRESS", "CLOSED"],
  IN_PROGRESS: ["WAITING_FOR_REQUESTER", "RESOLVED"],
  WAITING_FOR_REQUESTER: ["IN_PROGRESS", "RESOLVED"],
  RESOLVED: ["CLOSED", "IN_PROGRESS"],
  CLOSED: [],
};

export async function changeTicketStatus(
  ticketId: string,
  status: TicketStatus,
  actor: Actor,
) {
  const ticket = await ensureCanAccessTicket(ticketId, actor);

  if (actor.role === "REQUESTER") {
    throw new AppError(
      "Solicitantes não podem alterar o status do chamado.",
      403,
    );
  }

  if (actor.role === "TECHNICIAN" && ticket.technicianId !== actor.id) {
    throw new AppError("Você só pode alterar chamados atribuídos a você.", 403);
  }

  if (!allowedTransitions[ticket.status].includes(status)) {
    throw new AppError(
      `Não é permitido mudar de ${ticket.status} para ${status}.`,
      400,
    );
  }

  return prisma.ticket.update({
    where: { id: ticketId },
    data: {
      status,
      resolvedAt: status === "RESOLVED" ? new Date() : null,
      history: {
        create: {
          actorId: actor.id,
          action: "STATUS_CHANGED",
          details: `${ticket.status} -> ${status}`,
        },
      },
    },
    include: ticketDetails,
  });
}

export async function addComment(
  ticketId: string,
  content: string,
  actor: Actor,
) {
  await ensureCanAccessTicket(ticketId, actor);

  return prisma.comment.create({
    data: {
      ticketId,
      authorId: actor.id,
      content,
    },
    include: {
      author: {
        select: { id: true, name: true, role: true },
      },
    },
  });
}

export async function getTicketHistory(ticketId: string, actor: Actor) {
  await ensureCanAccessTicket(ticketId, actor);

  return prisma.ticketHistory.findMany({
    where: { ticketId },
    include: {
      actor: {
        select: { id: true, name: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });
}
