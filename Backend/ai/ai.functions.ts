import Product from "../Models/productModel.js";
import Cart from "../Models/cartModel.js";
import Category from "../Models/categoryModel.js";
import Order from "../Models/ordersModel.js";

// ─── Helper: get primary image URL from product ─────────────
const getPrimaryImage = (images: any[]): string => {
    if (!images || images.length === 0) return "";
    return images.find((img) => img.isPrimary)?.url || images[0]?.url || "";
};

// ─── All AI function executors ───────────────────────────────
export const aiFunctionExecutors = {

    // ─── Search Products ───────────────────────────────
    searchProducts: async (args: any) => {
        const { category, maxPrice, minPrice, processor, minRAM, keywords } = args;
        const query: any = {};

        if (keywords) {
            query.$or = [
                { name: { $regex: keywords, $options: "i" } },
                { brand: { $regex: keywords, $options: "i" } },
                { description: { $regex: keywords, $options: "i" } },
                { tags: { $in: [new RegExp(keywords, "i")] } },
            ];
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = minPrice;
            if (maxPrice) query.price.$lte = maxPrice;
        }

        if (processor) {
            const processorFilter = { $regex: processor, $options: "i" };
            const processorOr = [
                { "quickSpecs.value": processorFilter },
                { "specs.value": processorFilter },
                { tags: { $in: [new RegExp(processor, "i")] } },
            ];
            if (query.$or) {
                query.$and = [{ $or: query.$or }, { $or: processorOr }];
                delete query.$or;
            } else {
                query.$or = processorOr;
            }
        }

        if (minRAM) {
            query["quickSpecs.value"] = { $regex: `${minRAM}`, $options: "i" };
        }

        if (category) {
            const cat = await Category.findOne({ name: { $regex: category, $options: "i" } });
            if (cat) query.category = cat._id;
        }

        const products = await Product.find(query)
            .limit(5)
            .populate("category", "name");

        return products.map((p: any, index: number) => ({
            id: p._id.toString(),
            name: p.name,
            brand: p.brand,
            price: p.price,
            originalPrice: p.originalPrice ?? null,
            image: getPrimaryImage(p.images),
            category: p.category?.name ?? "",
            inStock: p.countInStock > 0,
            rating: p.rating,
            processor: p.quickSpecs?.find((s: any) =>
                s.label?.toLowerCase().includes("chip") ||
                s.label?.toLowerCase().includes("processor") ||
                s.label?.toLowerCase().includes("cpu")
            )?.value ?? "",
            link: `/products/${p._id}`,
            index: index + 1,
        }));
    },

    // ─── Get Product Details ───────────────────────────────
    getProductDetails: async (args: any) => {
        const { productId } = args;
        const product = await Product.findById(productId).populate("category", "name");
        if (!product) throw new Error("Product not found");

        return {
            id: product._id.toString(),
            name: product.name,
            brand: product.brand,
            price: product.price,
            originalPrice: product.originalPrice ?? null,
            image: getPrimaryImage(product.images),
            category: (product.category as any)?.name ?? "",
            inStock: product.countInStock > 0,
            countInStock: product.countInStock,
            rating: product.rating,
            numReviews: product.numReviews,
            quickSpecs: product.quickSpecs,
            description: product.description,
            deliveryDate: product.deliveryDate,
            warrantyYears: product.warrantyYears,
            link: `/products/${product._id}`,
        };
    },

    // ─── Add to Cart ───────────────────────────────
    addToCart: async (args: any, userId: string) => {
        const { productId, quantity = 1 } = args;
        if (!productId) throw new Error("Missing productId");

        const product = await Product.findById(productId).populate("category", "name");
        if (!product) throw new Error("Product not found");
        if (product.countInStock < quantity) {
            return { success: false, message: `Only ${product.countInStock} unit(s) available in stock.` };
        }

        const primaryImage = getPrimaryImage(product.images);
        const categoryName = (product.category as any)?.name ?? "";

        let cart = await Cart.findOne({ user: userId });
        if (!cart) cart = new Cart({ user: userId, cartItems: [] });

        const existIndex = cart.cartItems.findIndex(x => x.product === productId.toString());

        const cartItem = {
            product: productId.toString(),
            _id: productId.toString(),
            name: product.name,
            image: primaryImage,
            brand: product.brand,
            category: categoryName,
            countInStock: product.countInStock,
            qty: quantity,
            price: product.price,
        };

        if (existIndex >= 0) cart.cartItems[existIndex] = cartItem;
        else cart.cartItems.push(cartItem);

        // Recalculate totals
        const itemsPrice = cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
        const shippingPrice = itemsPrice > 100 ? 0 : 10;
        const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
        const totalPrice = itemsPrice + shippingPrice + taxPrice;

        cart.set({ itemsPrice, shippingPrice, taxPrice, totalPrice });
        await cart.save();

        return { success: true, productName: product.name, price: product.price, image: primaryImage };
    },

    // ─── View Cart ───────────────────────────────
    viewCart: async (_: any, userId: string) => {
        const cart = await Cart.findOne({ user: userId });
        if (!cart) return { cartItems: [], totalPrice: 0, itemCount: 0 };

        return {
            cartItems: cart.cartItems,
            itemsPrice: cart.itemsPrice,
            totalPrice: cart.totalPrice,
            itemCount: cart.cartItems.length,
        };
    },

    // ─── Remove from Cart ───────────────────────────────
    removeFromCart: async (args: any, userId: string) => {
        const { productId } = args;
        if (!productId) throw new Error("Missing productId");

        let cart = await Cart.findOne({ user: userId });
        if (!cart) return { success: false, message: "Cart not found" };

        // Remove item
        cart.cartItems = cart.cartItems.filter(item => item.product !== productId);

        // Recalculate totals
        const itemsPrice = cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
        const shippingPrice = itemsPrice > 100 ? 0 : 10;
        const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
        const totalPrice = itemsPrice + shippingPrice + taxPrice;

        cart.set({ itemsPrice, shippingPrice, taxPrice, totalPrice });
        await cart.save();

        return { success: true, message: "Product removed from cart" };
    },

    // ─── Clear Cart ───────────────────────────────
    clearCart: async (_: any, userId: string) => {
        const cart = await Cart.findOne({ user: userId });
        if (!cart) return { success: false, message: "Cart not found" };

        cart.cartItems = [];
        cart.itemsPrice = 0;
        cart.shippingPrice = 0;
        cart.taxPrice = 0;
        cart.totalPrice = 0;

        await cart.save();
        return { success: true, message: "Cart cleared successfully" };
    },

    // ─── Update Cart Quantity ───────────────────────────────
    updateCartQuantity: async (args: any, userId: string) => {
        const { productId, quantity } = args
        if (!productId) throw new Error("Missing productId");

        const product = await Product.findById(productId).populate("category", "name");
        if (!product) throw new Error("Product not found");
        if (product.countInStock < quantity) throw new Error("Not enough stock");

        let cart = await Cart.findOne({ user: userId });
        if (!cart) cart = new Cart({ user: userId, cartItems: [] });

        const existIndex = cart.cartItems.findIndex(x => x.product === productId.toString());
        const cartItem = {
            product: productId.toString(),
            _id: productId.toString(),
            name: product.name,
            image: getPrimaryImage(product.images),
            brand: product.brand,
            category: (product.category as any)?.name ?? "", countInStock: product.countInStock,
            qty: quantity,
            price: product.price,
        };

        if (existIndex >= 0) cart.cartItems[existIndex] = cartItem;
        else cart.cartItems.push(cartItem);

        const itemsPrice = cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
        const shippingPrice = itemsPrice > 100 ? 0 : 10;
        const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
        const totalPrice = itemsPrice + shippingPrice + taxPrice;

        cart.set({ itemsPrice, shippingPrice, taxPrice, totalPrice });
        await cart.save();

        return { success: true, productName: product.name, price: product.price, image: getPrimaryImage(product.images) };
    },

    // ─── Get Cart Total ───────────────────────────────
    getCartTotal: async (_: any, userId: string) => {
        const cart = await Cart.findOne({ user: userId });
        if (!cart) return { success: false, message: "Cart not found" };
        return {
            itemsPrice: cart.itemsPrice,
            shippingPrice: cart.shippingPrice,
            taxPrice: cart.taxPrice,
            totalPrice: cart.totalPrice,
        };
    },

    // ── BACKEND FIX 3: checkoutCart — missing required fields ──
    checkoutCart: async (_: any, userId: string) => {
        const cart = await Cart.findOne({ user: userId });
        if (!cart || cart.cartItems.length === 0)
            return { success: false, message: 'Cart is empty' };

        const orderNumber = `TM-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

        const order = new Order({
            user: userId,
            orderNumber,                    // ← was missing, required
            shippingAddress: {},            // ← was missing, will be filled at checkout page
            paymentMethod: 'pending',       // ← will be set at checkout
            orderItems: cart.cartItems.map((item: any) => ({
                name: item.name,
                qty: item.qty,
                image: item.image,
                price: item.price,
                productID: item.product,
            })),
            itemsPrice: cart.itemsPrice,
            shippingPrice: cart.shippingPrice,
            taxPrice: cart.taxPrice,
            totalPrice: cart.totalPrice,
            status: 'pending',
        });

        await order.save();

        cart.cartItems = [];
        cart.itemsPrice = 0;
        cart.shippingPrice = 0;
        cart.taxPrice = 0;
        cart.totalPrice = 0;
        await cart.save();

        return {
            success: true,
            orderNumber,
            message: 'Order created. Redirecting to checkout to complete address and payment.',
            redirectTo: '/checkout',
        };
    },

    // ─── Remaining filter & compare functions ───────────────────────────────
    // Fix all filter functions with `await` and empty array check
    filterByCategory: async (args: any) => {
        const { category } = args;
        const result = await Product.find({ category: category });
        if (!result || result.length === 0) return { success: false, message: "No products found" };
        return { success: true, result };
    },

    filterByBrand: async (args: any) => {
        const { brand } = args;
        const result = await Product.find({ brand: brand });
        if (!result || result.length === 0) return { success: false, message: "No products found" };
        return { success: true, result };
    },

    filterByPrice: async (args: any) => {
        const { minPrice, maxPrice } = args;
        const result = await Product.find({ price: { $gte: minPrice, $lte: maxPrice } });
        if (!result || result.length === 0) return { success: false, message: "No products found" };
        return { success: true, result };
    },

    filterByRating: async (args: any) => {
        const { rating } = args;
        const result = await Product.find({ rating: { $gte: rating } });
        if (!result || result.length === 0) return { success: false, message: "No products found" };
        return { success: true, result };
    },

    filterByStock: async (args: any) => {
        const { stock } = args;
        const result = await Product.find({ countInStock: { $gte: stock } });
        if (!result || result.length === 0) return { success: false, message: "No products found" };
        return { success: true, result };
    },

    filterByPriceAndRating: async (args: any) => {
        const { minPrice, maxPrice, rating } = args;
        const result = await Product.find({ price: { $gte: minPrice, $lte: maxPrice }, rating: { $gte: rating } });
        if (!result || result.length === 0) return { success: false, message: "No products found" };
        return { success: true, result };
    },

    filterByPriceAndStock: async (args: any) => {
        const { minPrice, maxPrice, stock } = args;
        const result = await Product.find({ price: { $gte: minPrice, $lte: maxPrice }, countInStock: { $gte: stock } });
        if (!result || result.length === 0) return { success: false, message: "No products found" };
        return { success: true, result };
    },

    filterByRatingAndStock: async (args: any) => {
        const { rating, stock } = args;
        const result = await Product.find({ rating: { $gte: rating }, countInStock: { $gte: stock } });
        if (!result || result.length === 0) return { success: false, message: "No products found" };
        return { success: true, result };
    },

    filterByPriceAndRatingAndStock: async (args: any) => {
        const { minPrice, maxPrice, rating, stock } = args;
        const result = await Product.find({ price: { $gte: minPrice, $lte: maxPrice }, rating: { $gte: rating }, countInStock: { $gte: stock } });
        if (!result || result.length === 0) return { success: false, message: "No products found" };
        return { success: true, result };
    },

    compareProducts: async (args: any) => {
        const { productIds } = args;
        const result = await Product.find({ _id: { $in: productIds } });
        if (!result || result.length === 0) return { success: false, message: "No products found" };
        return { success: true, result };
    },

    searchByIntent: async (args: any) => {
        const { userQuery } = args;
        const result = await Product.find({ $text: { $search: userQuery } });
        if (!result || result.length === 0) return { success: false, message: "No products found" };
        return { success: true, result };
    },
    // ── BACKEND FIX 1: Add missing getRecommendedProducts executor ──
    // ai.functions.ts — add this to aiFunctionExecutors:

    getRecommendedProducts: async (args: any, userId: string) => {
        const { limit = 5, category } = args;
        const query: any = {};

        // Try to base on user's last order
        const lastOrder = await Order.findOne({ user: userId })
            .sort({ createdAt: -1 })
            .limit(1);

        if (lastOrder && lastOrder.orderItems.length > 0) {
            const productIds = lastOrder.orderItems.map((i: any) => i.productID);
            const orderedProducts = await Product.find({ _id: { $in: productIds } })
                .populate('category', 'name');

            if (orderedProducts.length > 0 && !category) {
                // Recommend from same category as last ordered item
                query.category = (orderedProducts[0].category as any)?._id;
                query._id = { $nin: productIds }; // exclude already bought
            }
        }

        if (category) {
            const cat = await Category.findOne({ name: { $regex: category, $options: 'i' } });
            if (cat) query.category = cat._id;
        }

        const products = await Product.find(query)
            .limit(limit)
            .sort({ rating: -1 })
            .populate('category', 'name');

        return products.map((p: any, index: number) => ({
            id: p._id.toString(),
            name: p.name,
            brand: p.brand,
            price: p.price,
            image: getPrimaryImage(p.images),
            category: p.category?.name ?? '',
            inStock: p.countInStock > 0,
            rating: p.rating,
            link: `/products/${p._id}`,
            index: index + 1,
        }));
    },
};