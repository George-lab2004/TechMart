import { FunctionDeclaration, SchemaType } from "@google/generative-ai";

export const functionDefinitions: FunctionDeclaration[] = [
    {
        name: "searchProducts",
        description: "Search products using filters like category, price range, processor, RAM, and keywords.",
        parameters: {
            type: SchemaType.OBJECT,
            properties: {
                category: { type: SchemaType.STRING, description: "Product category e.g. 'phones', 'laptops'" },
                maxPrice: { type: SchemaType.NUMBER, description: "Maximum price in USD" },
                minPrice: { type: SchemaType.NUMBER, description: "Minimum price in USD" },
                processor: { type: SchemaType.STRING, description: "Processor name e.g. 'Intel i5', 'M2'" },
                minRAM: { type: SchemaType.NUMBER, description: "Minimum RAM in GB" },
                keywords: { type: SchemaType.STRING, description: "General keyword search" }
            },
            required: []
        }
    },
    {
        name: "getProductDetails",
        description: "Get full details of a product by its ID",
        parameters: {
            type: SchemaType.OBJECT,
            properties: {
                productId: { type: SchemaType.STRING, description: "Product ID" }
            },
            required: ["productId"]
        }
    },
    {
        name: "addToCart",
        description: "Add a product to the user's shopping cart",
        parameters: {
            type: SchemaType.OBJECT,
            properties: {
                productId: { type: SchemaType.STRING, description: "Product ID" },
                quantity: { type: SchemaType.NUMBER, description: "Quantity to add" }
            },
            required: ["productId"]
        }
    },
    {
        name: "viewCart",
        description: "View cart contents",
        parameters: { type: SchemaType.OBJECT, properties: {} }
    },
    {
        name: "removeFromCart",
        description: "Remove a product from the cart",
        parameters: {
            type: SchemaType.OBJECT,
            properties: {
                productId: { type: SchemaType.STRING, description: "Product ID" },
                quantity: { type: SchemaType.NUMBER, description: "Quantity to remove (optional)" }
            },
            required: ["productId"]
        }
    },
    {
        name: "clearCart",
        description: "Remove all items from cart",
        parameters: { type: SchemaType.OBJECT, properties: {} }
    },
    {
        name: "updateCartQuantity",
        description: "Update product quantity in cart",
        parameters: {
            type: SchemaType.OBJECT,
            properties: {
                productId: { type: SchemaType.STRING, description: "Product ID" },
                quantity: { type: SchemaType.NUMBER, description: "New quantity" }
            },
            required: ["productId", "quantity"]
        }
    },
    {
        name: "getCartTotal",
        description: "Get total price of items in cart",
        parameters: { type: SchemaType.OBJECT, properties: {} }
    },
    {
        name: "checkoutCart",
        description: "Navigate to checkout page",
        parameters: { type: SchemaType.OBJECT, properties: {} }
    },
    {
        name: "getRecommendedProducts",
        description: "Get recommended products based on cart or last orders",
        parameters: {
            type: SchemaType.OBJECT,
            properties: {
                limit: { type: SchemaType.NUMBER, description: "Number of products to recommend" },
                category: { type: SchemaType.STRING, description: "Category filter (optional)" },
                orderId: { type: SchemaType.STRING, description: "Order ID (optional)" }
            },
            required: ["limit"]
        }
    },
    {
        name: "filterByCategory",
        description: "Search product by a specific category",
        parameters: {
            type: SchemaType.OBJECT,
            properties: {
                category: { type: SchemaType.STRING, description: "Product category" }
            },
            required: ["category"]
        }
    },
    {
        name: "filterByPrice",
        description: "Search product by a price range",
        parameters: {
            type: SchemaType.OBJECT,
            properties: {
                minPrice: { type: SchemaType.NUMBER, description: "Minimum price" },
                maxPrice: { type: SchemaType.NUMBER, description: "Maximum price" }
            },
            required: ["minPrice", "maxPrice"]
        }
    },
    { name: "filterByBrand", description: "Search product by a specific brand", parameters: { type: SchemaType.OBJECT, properties: { brand: { type: SchemaType.STRING, description: "Product brand" } }, required: ["brand"] } },
    { name: "filterByRating", description: "Search product by a specific rating", parameters: { type: SchemaType.OBJECT, properties: { rating: { type: SchemaType.NUMBER, description: "Product rating" } }, required: ["rating"] } },
    { name: "filterByStock", description: "Search product by a specific stock", parameters: { type: SchemaType.OBJECT, properties: { stock: { type: SchemaType.NUMBER, description: "Product stock" } }, required: ["stock"] } },
    { name: "filterByPriceAndRating", description: "Search product by a price range and rating", parameters: { type: SchemaType.OBJECT, properties: { minPrice: { type: SchemaType.NUMBER, description: "Minimum price" }, maxPrice: { type: SchemaType.NUMBER, description: "Maximum price" }, rating: { type: SchemaType.NUMBER, description: "Product rating" } }, required: ["minPrice", "maxPrice", "rating"] } },
    { name: "filterByPriceAndStock", description: "Search product by a price range and stock", parameters: { type: SchemaType.OBJECT, properties: { minPrice: { type: SchemaType.NUMBER, description: "Minimum price" }, maxPrice: { type: SchemaType.NUMBER, description: "Maximum price" }, stock: { type: SchemaType.NUMBER, description: "Product stock" } }, required: ["minPrice", "maxPrice", "stock"] } },
    { name: "filterByRatingAndStock", description: "Search product by a rating and stock", parameters: { type: SchemaType.OBJECT, properties: { rating: { type: SchemaType.NUMBER, description: "Product rating" }, stock: { type: SchemaType.NUMBER, description: "Product stock" } }, required: ["rating", "stock"] } },
    { name: "filterByPriceAndRatingAndStock", description: "Search product by a price range and rating and stock", parameters: { type: SchemaType.OBJECT, properties: { minPrice: { type: SchemaType.NUMBER, description: "Minimum price" }, maxPrice: { type: SchemaType.NUMBER, description: "Maximum price" }, rating: { type: SchemaType.NUMBER, description: "Product rating" }, stock: { type: SchemaType.NUMBER, description: "Product stock" } }, required: ["minPrice", "maxPrice", "rating", "stock"] } },
    {
        name: "compareProducts",
        description: "Compare two or more products side by side",
        parameters: {
            type: SchemaType.OBJECT,
            properties: {
                productIds: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING }, description: "Array of product IDs to compare" }
            },
            required: ["productIds"]
        }
    },
    {
        name: "searchByIntent",
        description: "Search products by natural language user intent",
        parameters: {
            type: SchemaType.OBJECT,
            properties: {
                userQuery: { type: SchemaType.STRING, description: "User's natural language request" }
            },
            required: ["userQuery"]
        }
    }
];