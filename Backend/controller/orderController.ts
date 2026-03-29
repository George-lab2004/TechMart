import { Request, Response } from "express";
import { asyncHandler } from "../Middleware/asyncHandler.js";
import Order from "../Models/ordersModel.js";
import Cart from "../Models/cartModel.js";
import { IUser } from "../Models/userModel.js";

interface CustomRequest extends Request {
    user?: IUser | null;
}

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req: CustomRequest, res: Response) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error("No order items");
    } else {
        const order = new Order({
            orderItems: orderItems.map((x: any) => ({
                ...x,
                productID: x._id,
                _id: undefined,
            })),
            user: req.user?._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            orderNumber: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            isPaid: paymentMethod !== "cod", // Assume paid if not COD (logic can be refined)
            paidAt: paymentMethod !== "cod" ? new Date() : undefined,
        });

        const createdOrder = await order.save();

        // Clear the user's cart after successful order
        await Cart.findOneAndDelete({ user: req.user?._id });

        res.status(201).json(createdOrder);
    }
});

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

export { addOrderItems, getMyOrders, getOrderById };
