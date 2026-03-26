import { asyncHandler } from "../Middleware/asyncHandler.js";
import { Request, Response } from "express"
import Cart from "../Models/cartModel.js";

// Helper to calculate totals based on items array
const calculateTotals = (items: any[]) => {
    const itemsPrice = items.reduce((acc, item) => acc + item.price * item.qty, 0);
    const shippingPrice = itemsPrice > 100 ? 0 : 10;
    const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
    const totalPrice = itemsPrice + shippingPrice + taxPrice;
    return { itemsPrice, shippingPrice, taxPrice, totalPrice };
};

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
export const GetCart = asyncHandler(async (req: any, res: Response) => {
    let cart = await Cart.findOne({ user: req.user._id })
    if (!cart) {
        cart = await Cart.create({ user: req.user._id, cartItems: [] })
    }
    res.status(200).json(cart)
})

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
export const AddToCart = asyncHandler(async (req: any, res: Response) => {
    const productId = req.body.product || req.body._id;
    let cart = await Cart.findOne({ user: req.user._id })
    
    if (!cart) {
        cart = new Cart({ user: req.user._id, cartItems: [] })
    }

    const existItemIndex = cart.cartItems.findIndex(x => x.product.toString() === productId);
    if (existItemIndex >= 0) {
        cart.cartItems[existItemIndex].qty = req.body.qty; 
    } else {
        cart.cartItems.push({ 
            ...req.body, 
            product: productId, 
            _id: req.body._id || productId 
        });
    }

    const totals = calculateTotals(cart.cartItems);
    cart.set(totals);
    await cart.save();

    res.status(200).json(cart)
})

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
export const RemoveFromCart = asyncHandler(async (req: any, res: Response) => {
    const productId = req.params.id;
    let cart = await Cart.findOne({ user: req.user._id })

    if (cart) {
        cart.cartItems = cart.cartItems.filter(x => x.product.toString() !== productId);
        const totals = calculateTotals(cart.cartItems);
        cart.set(totals);
        await cart.save();
    }
    
    res.status(200).json(cart)
})

// @desc    Sync localStorage cart to DB on login
// @route   POST /api/cart/sync
// @access  Private
export const SyncCart = asyncHandler(async (req: any, res: Response) => {
    const localItems = req.body; // Array of items
    let cart = await Cart.findOne({ user: req.user._id })

    if (!cart) {
        cart = new Cart({ user: req.user._id, cartItems: [] })
    }

    // Replace entire cart with the incoming one (or merge logic depending on business needs, here we merge/override)
    localItems.forEach((localItem: any) => {
        const productId = localItem.product || localItem._id;
        const existItemIndex = cart.cartItems.findIndex(x => x.product.toString() === productId);
        if (existItemIndex >= 0) {
            cart.cartItems[existItemIndex].qty = localItem.qty; 
        } else {
            cart.cartItems.push({
                ...localItem,
                product: productId,
                _id: localItem._id || productId
            });
        }
    });

    const totals = calculateTotals(cart.cartItems);
    cart.set(totals);
    await cart.save();

    res.status(200).json(cart)
})

// @desc    Clear user cart
// @route   DELETE /api/cart
// @access  Private
export const ClearCart = asyncHandler(async (req: any, res: Response) => {
    let cart = await Cart.findOne({ user: req.user._id })
    if (cart) {
        cart.cartItems = [];
        cart.set({ itemsPrice: 0, shippingPrice: 0, taxPrice: 0, totalPrice: 0 });
        await cart.save();
    }
    res.status(200).json({ message: "Cart Cleared", cart })
})

// @desc    Get all carts (admin)
// @route   GET /api/cart/admin
// @access  Private/Admin
export const GetAllCarts = asyncHandler(async (req: any, res: Response) => {
    const carts = await Cart.find().populate('user', 'name email')
    res.status(200).json(carts)
})

// @desc    Delete cart by ID (admin)
// @route   DELETE /api/cart/admin/:id
// @access  Private/Admin
export const DeleteCartByAdmin = asyncHandler(async (req: any, res: Response) => {
    const result = await Cart.findByIdAndDelete(req.params.id)
    res.status(200).json({ message: "Cart deleted" })
})