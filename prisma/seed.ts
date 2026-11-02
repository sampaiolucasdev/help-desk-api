import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const department = await prisma.department.upsert({
    where: { name: "Tecnologia da Informação" },
    update: {},
    create: { name: "Tecnologia da Informação" },
  });

  const categories = [
    "Computadores",
    "Impressoras",
    "Sistemas",
    "Acesso e Senhas",
  ];

  for (const name of categories) {
    const category = await prisma.category.findFirst({
      where: {
        name,
        departmentId: department.id,
      },
    });

    if (!category) {
      await prisma.category.create({
        data: {
          name,
          departmentId: department.id,
        },
      });
    }
  }

  const defaultPassword = process.env.SEED_DEFAULT_PASSWORD;

  if (!defaultPassword) {
    throw new Error("Configure SEED_DEFAULT_PASSWORD no arquivo .env.");
  }

  const passwordHash = await bcrypt.hash(defaultPassword, 12);

  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "Administrador de Desenvolvimento",
      email: "admin@example.com",
      passwordHash,
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: "tecnico@example.com" },
    update: {
      departmentId: department.id,
    },
    create: {
      name: "Técnico de Desenvolvimento",
      email: "tecnico@example.com",
      passwordHash,
      role: "TECHNICIAN",
      departmentId: department.id,
    },
  });

  console.log("Dados iniciais criados com sucesso.");
}

main()
  .catch((error) => {
    console.error("Erro ao criar dados iniciais:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
