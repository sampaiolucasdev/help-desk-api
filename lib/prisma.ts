import { PrismaClient } from "@prisma/client";

//CRIA UMA INSTÂNCIA REUTILIZÁVEL DO CLIENTE PRISMA PARA CONECTAR AO BANCO DE DADOS
export const prisma = new PrismaClient();
