import { Router } from "express";
import { getMyOrders, getOrderById } from "../controller/orderController.js";
import { protect } from "../Middleware/authMiddleware.js";

const orderRouter = Router();

orderRouter.route("/mine").get(protect, getMyOrders);
orderRouter.route("/:id").get(protect, getOrderById);

export { orderRouter };
