import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate";
import { authorizeRole } from "../../middlewares/authorize-roles";
import { validateBody } from "../../middlewares/validate-body";
import {
  createCategorySchema,
  createDepartmentSchema,
} from "./catalog.schemas";
import {
  getCategories,
  getDepartments,
  postCategory,
  postDepartment,
} from "./catalog.controller";

export const catalogRoutes = Router();

catalogRoutes.use(authenticate);

catalogRoutes.get("/departments", getDepartments);
catalogRoutes.get("/categories", getCategories);

catalogRoutes.post(
  "/departments",
  authorizeRole("ADMIN"),
  validateBody(createDepartmentSchema),
  postDepartment,
);

catalogRoutes.post(
  "/categories",
  authorizeRole("ADMIN"),
  validateBody(createCategorySchema),
  postCategory,
);
