import mongoose from "mongoose";
import { asyncHandler } from "../Middleware/asyncHandler.js";
import { Request, Response, NextFunction } from "express"
import Category from "../Models/categoryModel.js";

export const getCategories = asyncHandler(async (req: Request, res: Response) => {
    const result = await Category.find();

    res.status(200).json({
        message: "SUCCESS",
        result,
    });
});

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
    const { name, slug, description, color, glowColor, images } = req.body;
    const categoryExists = await Category.findOne({ slug });

    if (categoryExists) {
        res.status(400);
        throw new Error("Category already exists");
    }

    const category = await Category.create({
        name,
        slug,
        description,
        color,
        glowColor,
        images
    });

    res.status(201).json({ message: "SUCCESS", result: category });
});

export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
    const { name, slug, description, color, glowColor, images } = req.body;
    const category = await Category.findById(req.params.id);

    if (category) {
        category.name = name || category.name;
        category.slug = slug || category.slug;
        category.description = description || category.description;
        category.color = color || category.color;
        category.glowColor = glowColor || category.glowColor;
        category.images = images || category.images;

        const updatedCategory = await category.save();
        res.status(200).json({ message: "SUCCESS", result: updatedCategory });
    } else {
        res.status(404);
        throw new Error("Category not found");
    }
});

export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
    const category = await Category.findById(req.params.id);

    if (category) {
        const productsCount = await mongoose.model("Product").countDocuments({ category: category._id });
        if (productsCount > 0) {
            res.status(400);
            throw new Error(`Cannot delete category with ${productsCount} associated products`);
        }
        await Category.deleteOne({ _id: category._id });
        res.status(200).json({ message: "Category removed" });
    } else {
        res.status(404);
        throw new Error("Category not found");
    }
});