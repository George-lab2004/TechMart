import { addOrderItems, getMyOrders, getOrderById, getOrders, updateOrderToDelivered, updateOrderToPaid, updateOrderStatus } from "../controller/orderController.js";
import { protect, admin } from "../Middleware/authMiddleware.js";
import { validate } from "../Middleware/validate.js";
import { Router } from "express";

const orderRouter = Router();

orderRouter.route("/")
    .post(protect, addOrderItems)
    .get(protect, admin, getOrders);

orderRouter.route("/mine").get(protect, getMyOrders);
orderRouter.route("/:id").get(protect, getOrderById);
orderRouter.route("/:id/deliver").put(protect, admin, updateOrderToDelivered);
orderRouter.route("/:id/pay").put(protect, admin, updateOrderToPaid);
orderRouter.route("/:id/status").put(protect, admin, updateOrderStatus);

export { orderRouter };
