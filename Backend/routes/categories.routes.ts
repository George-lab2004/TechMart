import { Router } from "express";
import { getCategories } from "../controller/categoryController.js";
export const CategoriesRouter = Router()
CategoriesRouter.get("/categories", getCategories)