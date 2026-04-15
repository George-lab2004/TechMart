import express from "express"
import { getProduct, getAllProducts, getTopSellingProducts, getSingleProduct, addProduct, updateProduct, deleteProduct, createProductReview, getProductReviews } from "../controller/products.js"
import { protect, admin } from "../Middleware/authMiddleware.js"
import { demoGuard } from "../Middleware/demoMiddleware.js"

export const ProductsRouter = express.Router()

ProductsRouter.get("/products", getProduct)              // admin (paginated)
ProductsRouter.get("/products/all", getAllProducts)       // public storefront (all)
ProductsRouter.get("/products/top", getTopSellingProducts)
ProductsRouter.get("/products/:id", getSingleProduct)
ProductsRouter.post("/products", protect, admin, demoGuard, addProduct)
ProductsRouter.put("/products/:id", protect, admin, demoGuard, updateProduct)
ProductsRouter.delete("/products/:id", protect, admin, demoGuard, deleteProduct)

// Reviews
ProductsRouter.post("/products/:id/reviews", protect, demoGuard, createProductReview)
ProductsRouter.get("/products/:id/reviews", protect, getProductReviews)
