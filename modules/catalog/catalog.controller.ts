import type { RequestHandler } from "express";
import * as catalogService from "./catalog.service";

export const getDepartments: RequestHandler = async (_req, res, next) => {
  try {
    res.json({
      departments: await catalogService.listDepartments(),
    });
  } catch (error) {
    next(error);
  }
};

export const getCategories: RequestHandler = async (_req, res, next) => {
  try {
    res.json({
      categories: await catalogService.listCategories(),
    });
  } catch (error) {
    next(error);
  }
};

export const postDepartment: RequestHandler = async (req, res, next) => {
  try {
    const department = await catalogService.createDepartment(req.body.name);

    res.status(201).json({ department });
  } catch (error) {
    next(error);
  }
};

export const postCategory: RequestHandler = async (req, res, next) => {
  try {
    const category = await catalogService.createCategory(req.body);

    res.status(201).json({ category });
  } catch (error) {
    next(error);
  }
};
