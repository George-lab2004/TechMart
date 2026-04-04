import { Router } from "express";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../controller/categoryController.js";
import { protect, admin } from "../Middleware/authMiddleware.js";
import { validate } from "../Middleware/validate.js";
import { createCategorySchema, updateCategorySchema } from "../validators/category.schema.js";

export const CategoriesRouter = Router();

CategoriesRouter.route("/categories")
    .get(getCategories)
    .post(protect, admin, validate(createCategorySchema), createCategory);

CategoriesRouter.route("/categories/:id")
    .put(protect, admin, validate(updateCategorySchema), updateCategory)
    .delete(protect, admin, deleteCategory);