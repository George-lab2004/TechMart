import { Request, Response, NextFunction } from "express"
import Product from "../Models/productModel"
import "../Models/categoryModel"
import { asyncHandler } from "../Middleware/asyncHandler"

const getProduct = asyncHandler(async (req: Request, res: Response) => {
  const result = await Product.find().populate("category", "name slug")
  res.status(200).json({ message: "SUCCESS", result })
})

const getSingleProduct = asyncHandler(async (req: Request, res: Response) => {
  const result = await Product.findById(req.params.id).populate("category", "name slug")
  if (!result) {
    res.status(404).json({ message: "Product not found" })
    return
  }
  res.status(200).json({ message: "SUCCESS", result })
})

export { getProduct, getSingleProduct }