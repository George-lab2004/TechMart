import { Router } from "express";
import { addOrderItems, getMyOrders, getOrderById, getOrders, updateOrderToDelivered, updateOrderToPaid } from "../controller/orderController.js";
import { protect, admin } from "../Middleware/authMiddleware.js";

const orderRouter = Router();

orderRouter.route("/")
    .post(protect, addOrderItems)
    .get(protect, admin, getOrders);

orderRouter.route("/mine").get(protect, getMyOrders);
orderRouter.route("/:id").get(protect, getOrderById);
orderRouter.route("/:id/deliver").put(protect, admin, updateOrderToDelivered);
orderRouter.route("/:id/pay").put(protect, admin, updateOrderToPaid);

export { orderRouter };
