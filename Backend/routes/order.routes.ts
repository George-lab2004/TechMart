import { Router } from "express";
import { addOrderItems, getMyOrders, getOrderById } from "../controller/orderController.js";
import { protect } from "../Middleware/authMiddleware.js";

const orderRouter = Router();

orderRouter.route("/").post(protect, addOrderItems);
orderRouter.route("/mine").get(protect, getMyOrders);
orderRouter.route("/:id").get(protect, getOrderById);

export { orderRouter };
