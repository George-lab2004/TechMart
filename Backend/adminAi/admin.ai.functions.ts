import Product from "../Models/productModel.js";
import Cart from "../Models/cartModel.js";
import Category from "../Models/categoryModel.js";
import Order from "../Models/ordersModel.js";
const getPrimaryImage = (images: any[]): string => {
    if (!images || images.length === 0) return "";
    return images.find((img) => img.isPrimary)?.url ?? images[0]?.url ?? "";
};
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
    soldCount: p.soldCount ?? 0,
    rating: p.rating,
    numReviews: p.numReviews,
    badge: p.badge ?? null,
    slug: p.slug ?? "",
    quickSpecs: p.quickSpecs ?? [],
    link: `/products/${p._id}`,
    index: index + 1,
});
export const adminAiFunctions = {
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
    getTopSellingProducts: async (args: any) => {
        const { limit = 5 } = args
        const result = await Product.find({}).sort({ soldCount: -1 }).limit(limit).populate("category", "name").lean()
        if (!result || result.length === 0) return { found: false, message: "No products found." }
        return { found: true, products: result.map((p: any, i) => mapProduct(p, i)) };
    },
    getExpectedLowStockProducts: async (args: any) => {
        const { limit = 5 } = args
        const result = await Product.find({}).sort({ countInStock: 1 }).limit(limit).populate("category", "name").lean()
        if (!result || result.length === 0) return { found: false, message: "No products found." }
        return { found: true, products: result.map((p: any, i) => mapProduct(p, i)) };
    },
    getLowestPerformingProducts: async (args: any) => {
        const { limit = 10 } = args
        const result = await Product.find({}).sort({ soldCount: 1 }).limit(limit).populate("category", "name").lean()
        if (!result || result.length === 0) return { found: false, message: "No products found." }
        return { found: true, products: result.map((p: any, i) => mapProduct(p, i)) };
    },
    getRevenueSummaryStats: async (args: any) => {
        const { daysBack = 30 } = args;
        const dateLimit = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000);
        
        // Use MongoDB aggregation so we don't crash the AI's context limit by returning thousands of raw orders!
        const stats = await Order.aggregate([
            { $match: { createdAt: { $gte: dateLimit } } },
            { $group: {
                _id: null,
                totalOrders: { $sum: 1 },
                totalRevenue: { $sum: "$totalPrice" },
                avgOrderValue: { $avg: "$totalPrice" }
            }}
        ]);
        
        if (!stats || stats.length === 0) return { found: false, message: "No orders found in that timeframe." };
        
        const { _id, ...cleanStats } = stats[0];
        return { found: true, stats: cleanStats };
    },
    getRecentOrders: async (args: any) => {
        const { limit = 10 } = args
        const result = await Order.find({}).sort({ createdAt: -1 }).limit(limit).populate("user", "name").lean()
        if (!result || result.length === 0) return { found: false, message: "No orders found." }
        return { found: true, orders: result };
    },
    renderChart: async (args: any) => {
        // This is a "Dummy" executor! 
        // When Gemini calls it, the backend doesn't need to do any DB queries. 
        // It simply echoes exactly what Gemini gave it so the frontend can intercept it and render Recharts!
        return { success: true, chartData: args };
    }
}