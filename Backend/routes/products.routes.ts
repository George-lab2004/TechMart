import express from "express"
import { getProduct, getSingleProduct } from "../controller/products.js"
export const ProductsRouter = express.Router()
ProductsRouter.get("/products", getProduct)
ProductsRouter.get("/products/:id", getSingleProduct)


