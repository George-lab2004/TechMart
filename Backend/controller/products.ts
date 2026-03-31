import { Request, Response, NextFunction } from "express"
import Product from "../Models/productModel.js"
import "../Models/categoryModel.js"
import { asyncHandler } from "../Middleware/asyncHandler.js"

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
const getProductByCategory = asyncHandler(
  async (req, res) => {
    const { category } = req.params;

    const products = await Product.find({ category });

    if (products.length === 0) {
      res.status(404).json({ message: "No products found in this category" });
      return;
    }

    res.status(200).json({
      message: "SUCCESS",
      products,
    });
  }
);
const addProduct = asyncHandler(async (req: any, res: Response) => {
  const { user, ...productData } = req.body;
  const result = await Product.create({ ...productData, user: req.user?._id })
  res.status(200).json({ message: "SUCCESS", result })
})

const updateProduct = asyncHandler(async (req: any, res: Response) => {
  const { user, ...updateData } = req.body;
  const result = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true })
  if (!result) {
    res.status(404).json({ message: "Product not found" })
    return
  }
  res.status(200).json({ message: "SUCCESS", result })
})

const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const result = await Product.findByIdAndDelete(req.params.id)
  if (!result) {
    res.status(404).json({ message: "Product not found" })
    return
  }
  res.status(200).json({ message: "SUCCESS" })
})

export { getProduct, getSingleProduct, getProductByCategory, addProduct, updateProduct, deleteProduct }