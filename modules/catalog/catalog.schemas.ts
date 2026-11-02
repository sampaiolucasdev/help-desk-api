import { z } from "zod";

export const createDepartmentSchema = z.object({
  name: z.string().trim().min(2, "Informe o nome do departamento."),
});

export const createCategorySchema = z.object({
  name: z.string().trim().min(2, "Informe o nome da categoria."),
  departmentId: z.string().min(1, "Informe o departamento da categoria."),
});
