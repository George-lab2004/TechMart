import express from "express"
import { getProduct, getSingleProduct } from "../controller/products"
export const ProductsRouter = express.Router()
ProductsRouter.get("/products", getProduct)
ProductsRouter.get("/products/:id", getSingleProduct)


