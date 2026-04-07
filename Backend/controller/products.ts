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
const createProductReview = asyncHandler(async (req: any, res: Response) => {
  const { title, rating, comment } = req.body
  const product = await Product.findById(req.params.id)
  if (!product) {
    res.status(404).json({ message: "Product not found" })
    return
  }
  const alreadyReviewed = product.reviews.find((review) => review.user.toString() === req.user?._id.toString())
  if (alreadyReviewed) {
    res.status(400).json({ message: "Product already reviewed" })
    return
  }
  const review = {
    name: req.user.name,
    title,
    rating: Number(rating),
    comment,
    user: req.user._id
  }
  product.reviews.push(review as any)
  product.numReviews = product.reviews.length
  product.rating = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length

  // recalculate ratingBreakdown
  const breakdown = { five: 0, four: 0, three: 0, two: 0, one: 0 }
  for (const r of product.reviews) {
    if (r.rating === 5) breakdown.five++
    else if (r.rating === 4) breakdown.four++
    else if (r.rating === 3) breakdown.three++
    else if (r.rating === 2) breakdown.two++
    else if (r.rating === 1) breakdown.one++
  }
  product.ratingBreakdown = breakdown

  await product.save()
  res.status(201).json({ message: "Review added successfully" })
})

const getProductReviews = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id).select("reviews rating numReviews ratingBreakdown")
  if (!product) {
    res.status(404).json({ message: "Product not found" })
    return
  }
  res.status(200).json({ message: "SUCCESS", result: product })
})

export { getProduct, getSingleProduct, getProductByCategory, addProduct, updateProduct, deleteProduct, createProductReview, getProductReviews }