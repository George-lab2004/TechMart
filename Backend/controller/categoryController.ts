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