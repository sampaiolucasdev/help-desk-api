import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/app-error";

export async function listDepartments() {
  return prisma.department.findMany({
    orderBy: { name: "asc" },
  });
}

export async function listCategories() {
  return prisma.category.findMany({
    include: {
      department: {
        select: { id: true, name: true },
      },
    },
    orderBy: { name: "asc" },
  });
}

export async function createDepartment(name: string) {
  try {
    return await prisma.department.create({
      data: { name },
    });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      throw new AppError("Este departamento já existe.", 409);
    }

    throw error;
  }
}

export async function createCategory(data: {
  name: string;
  departmentId: string;
}) {
  const department = await prisma.department.findUnique({
    where: { id: data.departmentId },
  });

  if (!department) {
    throw new AppError("Departamento não encontrado.", 404);
  }

  try {
    return await prisma.category.create({
      data: {
        name: data.name,
        departmentId: data.departmentId,
      },
    });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      throw new AppError("Esta categoria já existe neste departamento.", 409);
    }

    throw error;
  }
}
