import { Router } from "express";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../controller/categoryController.js";
import { protect, admin } from "../Middleware/authMiddleware.js";

export const CategoriesRouter = Router();

CategoriesRouter.route("/categories")
    .get(getCategories)
    .post(protect, admin, createCategory);

CategoriesRouter.route("/categories/:id")
    .put(protect, admin, updateCategory)
    .delete(protect, admin, deleteCategory);