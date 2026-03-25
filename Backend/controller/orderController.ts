import { Request, Response } from "express";
import { asyncHandler } from "../Middleware/asyncHandler.js";
import Order from "../Models/ordersModel.js";
import { IUser } from "../Models/userModel.js";

interface CustomRequest extends Request {
    user?: IUser | null;
}

// @desc    Get logged in user orders
// @route   GET /api/orders/mine
// @access  Private
const getMyOrders = asyncHandler(async (req: CustomRequest, res: Response) => {
    const orders = await Order.find({ user: req.user?._id });
    res.status(200).json(orders);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req: CustomRequest, res: Response) => {
    const order = await Order.findById(req.params.id).populate("user", "name email");

    if (order) {
        res.status(200).json(order);
    } else {
        res.status(404);
        throw new Error("Order not found");
    }
});

export { getMyOrders, getOrderById };
