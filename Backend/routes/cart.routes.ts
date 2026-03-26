import { Router } from 'express'
import { GetCart, AddToCart, RemoveFromCart, SyncCart, ClearCart, GetAllCarts, DeleteCartByAdmin } from '../controller/cartController.js'
import { protect, admin } from '../Middleware/authMiddleware.js'

export const CartRouter = Router()

// User routes
CartRouter.route('/')
    .get(protect, GetCart)
    .post(protect, AddToCart)
    .delete(protect, ClearCart)

CartRouter.post("/sync", protect, SyncCart)
CartRouter.delete("/:id", protect, RemoveFromCart)

// Admin routes
CartRouter.get("/admin", protect, admin, GetAllCarts)
CartRouter.delete("/admin/:id", protect, admin, DeleteCartByAdmin)