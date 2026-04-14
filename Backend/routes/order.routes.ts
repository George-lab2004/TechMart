import { addOrderItems, getMyOrders, getOrderById, getOrders, updateOrderToDelivered, updateOrderToPaid, updateOrderStatus } from "../controller/orderController.js";
import { protect, admin } from "../Middleware/authMiddleware.js";
import { demoGuard } from "../Middleware/demoMiddleware.js";
import { validate } from "../Middleware/validate.js";
import { Router } from "express";

const orderRouter = Router();

orderRouter.route("/")
    .post(protect, demoGuard, addOrderItems)
    .get(protect, admin, getOrders);

orderRouter.route("/mine").get(protect, getMyOrders);
orderRouter.route("/:id").get(protect, getOrderById);
orderRouter.route("/:id/deliver").put(protect, admin, demoGuard, updateOrderToDelivered);
orderRouter.route("/:id/pay").put(protect, admin, demoGuard, updateOrderToPaid);
orderRouter.route("/:id/status").put(protect, admin, demoGuard, updateOrderStatus);

export { orderRouter };
