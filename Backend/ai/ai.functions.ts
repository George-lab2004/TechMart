import Product from "../Models/productModel.js";
import Cart from "../Models/cartModel.js";
import Category from "../Models/categoryModel.js";
import Order from "../Models/ordersModel.js";

// ─── Helper: get primary image URL ───────────────────────────────────────────
const getPrimaryImage = (images: any[]): string => {
    if (!images || images.length === 0) return "";
    return images.find((img) => img.isPrimary)?.url ?? images[0]?.url ?? "";
};

// ─── Helper: map a raw product doc to a clean response object ─────────────────
const mapProduct = (p: any, index: number) => ({
    id: p._id.toString(),
    name: p.name,
    brand: p.brand,
    price: p.price,
    originalPrice: p.originalPrice ?? null,
    image: getPrimaryImage(p.images),
    category: p.category?.name ?? "",
    inStock: p.countInStock > 0,
    countInStock: p.countInStock,
    rating: p.rating,
    numReviews: p.numReviews,
    badge: p.badge ?? null,
    slug: p.slug ?? "",
    quickSpecs: p.quickSpecs ?? [],
    link: `/products/${p._id}`,
    index: index + 1,
});

// ─── Helper: recalculate and save cart totals ──────────────────────────────────
const recalcCart = async (cart: any) => {
    const itemsPrice = cart.cartItems.reduce((acc: number, item: any) => acc + item.price * item.qty, 0);
    const shippingPrice = itemsPrice > 100 ? 0 : 10;
    const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
    const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));
    cart.set({ itemsPrice, shippingPrice, taxPrice, totalPrice });
    await cart.save();
};

// ─────────────────────────────────────────────────────────────────────────────
export const aiFunctionExecutors = {

    // ── SEARCH PRODUCTS ───────────────────────────────────────────────────────
    searchProducts: async (args: any) => {
        const { category, maxPrice, minPrice, processor, minRAM, keywords, brand, minRating, limit = 5 } = args;
        const query: any = {};

        if (keywords) {
            query.$or = [
                { name: { $regex: keywords, $options: "i" } },
                { brand: { $regex: keywords, $options: "i" } },
                { description: { $regex: keywords, $options: "i" } },
                { tags: { $in: [new RegExp(keywords, "i")] } },
            ];
        }

        if (brand) {
            query.brand = { $regex: brand, $options: "i" };
        }

        if (minPrice !== undefined || maxPrice !== undefined) {
            query.price = {};
            if (minPrice !== undefined) query.price.$gte = minPrice;
            if (maxPrice !== undefined) query.price.$lte = maxPrice;
        }

        if (minRating !== undefined) {
            query.rating = { $gte: minRating };
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
            .limit(limit)
            .populate("category", "name");

        if (products.length === 0) {
            return { found: false, message: "No products found. Try different keywords or filters." };
        }

        return { found: true, products: products.map((p: any, i) => mapProduct(p, i)) };
    },

    // ── SEARCH MULTIPLE PRODUCTS (for compareProducts) ─────────────────────────
    searchMultipleProducts: async (args: any) => {
        const { queries } = args;

        const results = await Promise.all(
            queries.map(async (keyword: string) => {
                const products = await Product.find({
                    $or: [
                        { name: { $regex: keyword, $options: "i" } },
                        { brand: { $regex: keyword, $options: "i" } },
                        { description: { $regex: keyword, $options: "i" } },
                        { tags: { $in: [new RegExp(keyword, "i")] } },
                    ],
                })
                    .limit(1)
                    .populate("category", "name");

                if (products.length === 0) {
                    return { query: keyword, found: false };
                }

                const p = products[0] as any;
                return {
                    query: keyword,
                    found: true,
                    id: p._id.toString(),
                    name: p.name,
                    brand: p.brand,
                    price: p.price,
                    image: getPrimaryImage(p.images),
                    rating: p.rating,
                    inStock: p.countInStock > 0,
                    quickSpecs: p.quickSpecs ?? [],
                    link: `/products/${p._id}`,
                };
            })
        );

        const allFound = results.every((r) => r.found);
        const missing = results.filter((r) => !r.found).map((r) => r.query);

        return { results, allFound, missing };
    },

    // ── GET PRODUCT DETAILS ───────────────────────────────────────────────────
    getProductDetails: async (args: any) => {
        const { productId } = args;
        const product = await Product.findById(productId).populate("category", "name");
        if (!product) return { found: false, message: "Product not found." };

        const p = product as any;
        return {
            found: true,
            id: p._id.toString(),
            name: p.name,
            brand: p.brand,
            price: p.price,
            originalPrice: p.originalPrice ?? null,
            image: getPrimaryImage(p.images),
            category: p.category?.name ?? "",
            inStock: p.countInStock > 0,
            countInStock: p.countInStock,
            rating: p.rating,
            numReviews: p.numReviews,
            quickSpecs: p.quickSpecs ?? [],
            specs: p.specs ?? [],
            description: p.description ?? "",
            deliveryDate: p.deliveryDate ?? null,
            warrantyYears: p.warrantyYears ?? null,
            returnDays: p.returnDays ?? null,
            link: `/products/${p._id}`,
        };
    },

    // ── SEARCH BY INTENT ──────────────────────────────────────────────────────
    searchByIntent: async (args: any) => {
        const { userQuery } = args;
        const products = await Product.find(
            { $text: { $search: userQuery } },
            { score: { $meta: "textScore" } }
        )
            .sort({ score: { $meta: "textScore" } })
            .limit(5)
            .populate("category", "name");

        if (products.length === 0) {
            // Fallback to regex if text index not available
            const fallback = await Product.find({
                $or: [
                    { name: { $regex: userQuery, $options: "i" } },
                    { description: { $regex: userQuery, $options: "i" } },
                    { tags: { $in: [new RegExp(userQuery, "i")] } },
                ],
            })
                .limit(5)
                .populate("category", "name");

            if (fallback.length === 0) {
                return { found: false, message: "No products found for that query." };
            }

            return { found: true, products: fallback.map((p: any, i) => mapProduct(p, i)) };
        }

        return { found: true, products: products.map((p: any, i) => mapProduct(p, i)) };
    },

    // ── ADD TO CART ───────────────────────────────────────────────────────────
    addToCart: async (args: any, userId: string) => {
        const { productId, quantity = 1 } = args;
        if (!productId) return { success: false, message: "Missing productId — search for the product first." };

        const product = await Product.findById(productId).populate("category", "name");
        if (!product) return { success: false, message: "Product not found." };

        const p = product as any;

        if (p.countInStock < quantity) {
            return { success: false, message: `Only ${p.countInStock} unit(s) available in stock.` };
        }

        let cart = await Cart.findOne({ user: userId });
        if (!cart) cart = new Cart({ user: userId, cartItems: [] });

        const existIndex = cart.cartItems.findIndex((x: any) => x.product?.toString() === productId.toString());

        const cartItem = {
            product: productId.toString(),
            _id: productId.toString(),
            name: p.name,
            image: getPrimaryImage(p.images),
            brand: p.brand,
            category: p.category?.name ?? "",
            countInStock: p.countInStock,
            qty: quantity,
            price: p.price,
        };

        if (existIndex >= 0) {
            cart.cartItems[existIndex] = cartItem;
        } else {
            cart.cartItems.push(cartItem);
        }

        await recalcCart(cart);

        return {
            success: true,
            productName: p.name,
            brand: p.brand,
            price: p.price,
            quantity,
            cartItem: cartItem, // Pass the exact item for frontend Redux state sync
            image: getPrimaryImage(p.images),
            message: `${p.name} (x${quantity}) added to your cart.`,
        };
    },

    // ── VIEW CART ─────────────────────────────────────────────────────────────
    viewCart: async (_: any, userId: string) => {
        const cart = await Cart.findOne({ user: userId });

        if (!cart || cart.cartItems.length === 0) {
            return { empty: true, cartItems: [], itemsPrice: 0, totalPrice: 0, itemCount: 0 };
        }

        return {
            empty: false,
            cartItems: cart.cartItems.map((item: any) => ({
                productId: item.product?.toString(),
                name: item.name,
                brand: item.brand,
                qty: item.qty,
                price: item.price,
                image: item.image,
                subtotal: Number((item.price * item.qty).toFixed(2)),
            })),
            itemsPrice: cart.itemsPrice,
            shippingPrice: cart.shippingPrice,
            taxPrice: cart.taxPrice,
            totalPrice: cart.totalPrice,
            itemCount: cart.cartItems.length,
        };
    },

    // ── REMOVE FROM CART ──────────────────────────────────────────────────────
    removeFromCart: async (args: any, userId: string) => {
        const { productId } = args;
        if (!productId) return { success: false, message: "Missing productId — view cart first to find it." };

        const cart = await Cart.findOne({ user: userId });
        if (!cart) return { success: false, message: "Cart not found." };

        const before = cart.cartItems.length;
        cart.cartItems = cart.cartItems.filter((item: any) => item.product?.toString() !== productId.toString());

        if (cart.cartItems.length === before) {
            return { success: false, message: "Product not found in cart." };
        }

        await recalcCart(cart);
        return { success: true, message: "Item removed from cart.", productId };
    },

    // ── CLEAR CART ────────────────────────────────────────────────────────────
    clearCart: async (_: any, userId: string) => {
        const cart = await Cart.findOne({ user: userId });
        if (!cart) return { success: false, message: "Cart not found." };

        cart.cartItems = [];
        cart.itemsPrice = 0;
        cart.shippingPrice = 0;
        cart.taxPrice = 0;
        cart.totalPrice = 0;
        await cart.save();

        return { success: true, message: "Cart cleared." };
    },

    // ── UPDATE CART QUANTITY ──────────────────────────────────────────────────
    updateCartQuantity: async (args: any, userId: string) => {
        const { productId, quantity } = args;   // fixed: was `qty`
        if (!productId) return { success: false, message: "Missing productId — view cart first." };
        if (!quantity || quantity < 1) return { success: false, message: "Quantity must be at least 1." };

        const product = await Product.findById(productId).populate("category", "name");
        if (!product) return { success: false, message: "Product not found." };

        const p = product as any;
        if (p.countInStock < quantity) {
            return { success: false, message: `Only ${p.countInStock} unit(s) in stock.` };
        }

        let cart = await Cart.findOne({ user: userId });
        if (!cart) return { success: false, message: "Cart not found." };

        const existIndex = cart.cartItems.findIndex((x: any) => x.product?.toString() === productId.toString());

        const cartItem = {
            product: productId.toString(),
            _id: productId.toString(),
            name: p.name,
            image: getPrimaryImage(p.images),
            brand: p.brand,
            category: p.category?.name ?? "",
            countInStock: p.countInStock,
            qty: quantity,
            price: p.price,
        };

        if (existIndex >= 0) {
            cart.cartItems[existIndex] = cartItem;
        } else {
            cart.cartItems.push(cartItem);
        }

        await recalcCart(cart);

        return {
            success: true,
            productName: p.name,
            quantity,
            price: p.price,
            cartItem: cartItem, // Add for frontend sync
            message: `Updated ${p.name} quantity to ${quantity}.`,
        };
    },

    // ── GET CART TOTAL ────────────────────────────────────────────────────────
    getCartTotal: async (_: any, userId: string) => {
        const cart = await Cart.findOne({ user: userId });
        if (!cart) return { success: false, message: "Cart not found." };

        return {
            success: true,
            itemsPrice: cart.itemsPrice,
            shippingPrice: cart.shippingPrice,
            taxPrice: cart.taxPrice,
            totalPrice: cart.totalPrice,
            itemCount: cart.cartItems.length,
        };
    },

    // ── CHECKOUT CART ─────────────────────────────────────────────────────────
    checkoutCart: async (_: any, userId: string) => {
        const cart = await Cart.findOne({ user: userId });
        if (!cart || cart.cartItems.length === 0) {
            return { success: false, message: "Your cart is empty." };
        }

        const orderNumber = `TM-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

        const order = new Order({
            user: userId,
            orderNumber,
            shippingAddress: {},         // filled on checkout page
            paymentMethod: "pending",  // filled on checkout page
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
            status: "pending",
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
            totalPrice: order.totalPrice,
            redirectTo: "/checkout",
            message: `Order ${orderNumber} created! Redirecting to checkout to add your address and payment.`,
        };
    },

    // ── GET RECOMMENDED PRODUCTS ──────────────────────────────────────────────
    getRecommendedProducts: async (args: any, userId: string) => {
        const { limit = 5, category } = args;
        const query: any = {};

        if (!category) {
            // Base on last order's category
            const lastOrder = await Order.findOne({ user: userId }).sort({ createdAt: -1 });

            if (lastOrder && lastOrder.orderItems.length > 0) {
                const lastProductId = (lastOrder.orderItems[0] as any).productID;
                const lastProduct = await Product.findById(lastProductId);

                if (lastProduct) {
                    query.category = lastProduct.category;
                    query._id = { $nin: lastOrder.orderItems.map((i: any) => i.productID) };
                }
            }
        } else {
            const cat = await Category.findOne({ name: { $regex: category, $options: "i" } });
            if (cat) query.category = cat._id;
        }

        const products = await Product.find(query)
            .limit(limit)
            .sort({ rating: -1, soldCount: -1 })
            .populate("category", "name");

        if (products.length === 0) {
            return { found: false, message: "No recommendations found." };
        }

        return { found: true, products: products.map((p: any, i) => mapProduct(p, i)) };
    },

    // ── COMPARE PRODUCTS ──────────────────────────────────────────────────────
    compareProducts: async (args: any) => {
        const { productIds } = args;

        if (!productIds || productIds.length < 2) {
            return { success: false, message: "Need at least 2 product IDs to compare." };
        }

        const products = await Product.find({ _id: { $in: productIds } }).populate("category", "name");

        if (products.length === 0) {
            return { success: false, message: "No products found for comparison." };
        }

        return {
            success: true,
            products: products.map((p: any) => ({
                id: p._id.toString(),
                name: p.name,
                brand: p.brand,
                price: p.price,
                originalPrice: p.originalPrice ?? null,
                image: getPrimaryImage(p.images),
                category: p.category?.name ?? "",
                rating: p.rating,
                numReviews: p.numReviews,
                inStock: p.countInStock > 0,
                countInStock: p.countInStock,
                quickSpecs: p.quickSpecs ?? [],
                warrantyYears: p.warrantyYears ?? null,
                returnDays: p.returnDays ?? null,
                link: `/products/${p._id}`,
            })),
        };
    },

    // ── FILTER FUNCTIONS ──────────────────────────────────────────────────────
    filterByCategory: async (args: any) => {
        const { category } = args;
        const cat = await Category.findOne({ name: { $regex: category, $options: "i" } });
        if (!cat) return { found: false, message: `Category '${category}' not found.` };

        const products = await Product.find({ category: cat._id })
            .limit(10)
            .populate("category", "name");

        if (products.length === 0) return { found: false, message: "No products in that category." };
        return { found: true, products: products.map((p: any, i) => mapProduct(p, i)) };
    },

    filterByBrand: async (args: any) => {
        const { brand } = args;
        const products = await Product.find({ brand: { $regex: brand, $options: "i" } })
            .limit(10)
            .populate("category", "name");

        if (products.length === 0) return { found: false, message: `No products found for brand '${brand}'.` };
        return { found: true, products: products.map((p: any, i) => mapProduct(p, i)) };
    },

    filterByPrice: async (args: any) => {
        const { minPrice, maxPrice } = args;
        const products = await Product.find({ price: { $gte: minPrice, $lte: maxPrice } })
            .limit(10)
            .populate("category", "name");

        if (products.length === 0) return { found: false, message: "No products in that price range." };
        return { found: true, products: products.map((p: any, i) => mapProduct(p, i)) };
    },

    filterByRating: async (args: any) => {
        const { rating } = args;
        const products = await Product.find({ rating: { $gte: rating } })
            .limit(10)
            .populate("category", "name");

        if (products.length === 0) return { found: false, message: `No products with rating ${rating}+.` };
        return { found: true, products: products.map((p: any, i) => mapProduct(p, i)) };
    },

    filterByStock: async (args: any) => {
        const { stock } = args;
        const products = await Product.find({ countInStock: { $gte: stock } })
            .limit(10)
            .populate("category", "name");

        if (products.length === 0) return { found: false, message: "No products with that stock level." };
        return { found: true, products: products.map((p: any, i) => mapProduct(p, i)) };
    },

    filterByPriceAndRating: async (args: any) => {
        const { minPrice, maxPrice, rating } = args;
        const products = await Product.find({
            price: { $gte: minPrice, $lte: maxPrice },
            rating: { $gte: rating },
        })
            .limit(10)
            .populate("category", "name");

        if (products.length === 0) return { found: false, message: "No products match those filters." };
        return { found: true, products: products.map((p: any, i) => mapProduct(p, i)) };
    },

    filterByPriceAndStock: async (args: any) => {
        const { minPrice, maxPrice, stock } = args;
        const products = await Product.find({
            price: { $gte: minPrice, $lte: maxPrice },
            countInStock: { $gte: stock },
        })
            .limit(10)
            .populate("category", "name");

        if (products.length === 0) return { found: false, message: "No products match those filters." };
        return { found: true, products: products.map((p: any, i) => mapProduct(p, i)) };
    },

    filterByRatingAndStock: async (args: any) => {
        const { rating, stock } = args;
        const products = await Product.find({
            rating: { $gte: rating },
            countInStock: { $gte: stock },
        })
            .limit(10)
            .populate("category", "name");

        if (products.length === 0) return { found: false, message: "No products match those filters." };
        return { found: true, products: products.map((p: any, i) => mapProduct(p, i)) };
    },

    filterByPriceAndRatingAndStock: async (args: any) => {
        const { minPrice, maxPrice, rating, stock } = args;
        const products = await Product.find({
            price: { $gte: minPrice, $lte: maxPrice },
            rating: { $gte: rating },
            countInStock: { $gte: stock },
        })
            .limit(10)
            .populate("category", "name");

        if (products.length === 0) return { found: false, message: "No products match those filters." };
        return { found: true, products: products.map((p: any, i) => mapProduct(p, i)) };
    },
};