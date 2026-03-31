import express from "express"
import { getProduct, getSingleProduct, addProduct, updateProduct, deleteProduct } from "../controller/products.js"
import { protect, admin } from "../Middleware/authMiddleware.js"
export const ProductsRouter = express.Router()
ProductsRouter.get("/products", getProduct)
ProductsRouter.get("/products/:id", getSingleProduct)
ProductsRouter.post("/products", protect, admin, addProduct)
ProductsRouter.put("/products/:id", protect, admin, updateProduct)
ProductsRouter.delete("/products/:id", protect, admin, deleteProduct)


