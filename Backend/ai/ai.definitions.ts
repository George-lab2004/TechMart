import { FunctionDeclaration, SchemaType } from "@google/generative-ai";

export const functionDefinitions: FunctionDeclaration[] = [

    // ── SEARCH ────────────────────────────────────────────────────────────
    {
        name: "searchProducts",
        description: "Search products using filters like category, price range, processor, RAM, and keywords. Always call this first before addToCart, getProductDetails, removeFromCart, or updateCartQuantity to resolve a product name into a real ID.",
        parameters: {
            type: SchemaType.OBJECT,
            properties: {
                category: { type: SchemaType.STRING, description: "Product category e.g. 'phones', 'laptops'" },
                maxPrice: { type: SchemaType.NUMBER, description: "Maximum price in USD" },
                minPrice: { type: SchemaType.NUMBER, description: "Minimum price in USD" },
                processor: { type: SchemaType.STRING, description: "Processor name e.g. 'Intel i5', 'M2', 'M4'" },
                minRAM: { type: SchemaType.NUMBER, description: "Minimum RAM in GB" },
                keywords: { type: SchemaType.STRING, description: "General keyword search — product name, brand, or description" },
                brand: { type: SchemaType.STRING, description: "Brand name e.g. 'Apple', 'Sony', 'Samsung'" },
                minRating: { type: SchemaType.NUMBER, description: "Minimum product rating (0-5)" },
                limit: { type: SchemaType.NUMBER, description: "Max number of results to return, defaults to 5" },
            },
            required: [],
        },
    },

    {
        name: "searchMultipleProducts",
        description: "Search for multiple products by name simultaneously. Use this before compareProducts when the user wants to compare two or more products by name, to resolve all names to real IDs in one step.",
        parameters: {
            type: SchemaType.OBJECT,
            properties: {
                queries: {
                    type: SchemaType.ARRAY,
                    items: { type: SchemaType.STRING },
                    description: "Array of product name keywords to search for e.g. ['MacBook Pro', 'Dell XPS 15']",
                },
            },
            required: ["queries"],
        },
    },

    {
        name: "getProductDetails",
        description: "Get full details of a single product by its ID. Always call searchProducts first to get the real ID from a product name — never ask the user for an ID.",
        parameters: {
            type: SchemaType.OBJECT,
            properties: {
                productId: { type: SchemaType.STRING, description: "MongoDB product ID obtained from a previous searchProducts call" },
            },
            required: ["productId"],
        },
    },

    {
        name: "searchByIntent",
        description: "Search products using a full natural language user query when keywords alone are not enough. Use this for vague or intent-based queries like 'something good for gaming under $800'.",
        parameters: {
            type: SchemaType.OBJECT,
            properties: {
                userQuery: { type: SchemaType.STRING, description: "User's full natural language request" },
            },
            required: ["userQuery"],
        },
    },

    // ── CART ──────────────────────────────────────────────────────────────
    {
        name: "addToCart",
        description: "Add a product to the user's shopping cart. Requires an exact MongoDB product ID. Look in your immediate message history for the [Internal Context] to find the 'id' of the product the user is referring to, then pass it here.",
        parameters: {
            type: SchemaType.OBJECT,
            properties: {
                productId: { type: SchemaType.STRING, description: "Exact MongoDB product ID (usually 24 hex characters) from your history" },
                quantity: { type: SchemaType.NUMBER, description: "Quantity to add, defaults to 1" },
            },
            required: ["productId"],
        },
    },

    {
        name: "viewCart",
        description: "View all items currently in the user's shopping cart including quantities, prices, and totals.",
        parameters: {
            type: SchemaType.OBJECT,
            properties: {},
        },
    },

    {
        name: "removeFromCart",
        description: "Remove a product from the cart. Call viewCart first to find the product ID from the item name — never ask the user for the ID.",
        parameters: {
            type: SchemaType.OBJECT,
            properties: {
                productId: { type: SchemaType.STRING, description: "MongoDB product ID obtained from viewCart" },
            },
            required: ["productId"],
        },
    },

    {
        name: "clearCart",
        description: "Remove all items from the cart at once.",
        parameters: {
            type: SchemaType.OBJECT,
            properties: {},
        },
    },

    {
        name: "updateCartQuantity",
        description: "Update the quantity of a product already in the cart. Call viewCart first to find the product ID from the item name — never ask the user for the ID.",
        parameters: {
            type: SchemaType.OBJECT,
            properties: {
                productId: { type: SchemaType.STRING, description: "MongoDB product ID obtained from viewCart" },
                quantity: { type: SchemaType.NUMBER, description: "New quantity to set" },
            },
            required: ["productId", "quantity"],
        },
    },

    {
        name: "getCartTotal",
        description: "Get the full price breakdown of the cart: items price, tax, shipping, and total.",
        parameters: {
            type: SchemaType.OBJECT,
            properties: {},
        },
    },

    {
        name: "checkoutCart",
        description: "Initiates the checkout process. Call this when the user says they want to checkout, pay, buy, or finish their order.",
        parameters: {
            type: SchemaType.OBJECT,
            properties: {},
        },
    },

    // ── RECOMMENDATIONS & COMPARE ─────────────────────────────────────────
    {
        name: "getRecommendedProducts",
        description: "Get recommended products based on the user's cart or last orders. Can optionally filter by category.",
        parameters: {
            type: SchemaType.OBJECT,
            properties: {
                limit: { type: SchemaType.NUMBER, description: "Number of products to recommend" },
                category: { type: SchemaType.STRING, description: "Optional category filter" },
                orderId: { type: SchemaType.STRING, description: "Optional specific order ID to base recommendations on" },
            },
            required: ["limit"],
        },
    },

    {
        name: "compareProducts",
        description: "Compare two or more products side by side using their IDs. Always call searchMultipleProducts first to resolve product names to IDs — never ask the user for IDs.",
        parameters: {
            type: SchemaType.OBJECT,
            properties: {
                productIds: {
                    type: SchemaType.ARRAY,
                    items: { type: SchemaType.STRING },
                    description: "Array of MongoDB product IDs obtained from searchMultipleProducts",
                },
            },
            required: ["productIds"],
        },
    },

    // ── FILTERS ───────────────────────────────────────────────────────────
    {
        name: "filterByCategory",
        description: "Filter and list products belonging to a specific category.",
        parameters: {
            type: SchemaType.OBJECT,
            properties: {
                category: { type: SchemaType.STRING, description: "Category name e.g. 'laptops', 'phones'" },
            },
            required: ["category"],
        },
    },

    {
        name: "filterByPrice",
        description: "Filter products within a specific price range.",
        parameters: {
            type: SchemaType.OBJECT,
            properties: {
                minPrice: { type: SchemaType.NUMBER, description: "Minimum price in USD" },
                maxPrice: { type: SchemaType.NUMBER, description: "Maximum price in USD" },
            },
            required: ["minPrice", "maxPrice"],
        },
    },

    {
        name: "filterByBrand",
        description: "Filter and list products from a specific brand.",
        parameters: {
            type: SchemaType.OBJECT,
            properties: {
                brand: { type: SchemaType.STRING, description: "Brand name e.g. 'Apple', 'Sony'" },
            },
            required: ["brand"],
        },
    },

    {
        name: "filterByRating",
        description: "Filter products with a rating at or above the given value.",
        parameters: {
            type: SchemaType.OBJECT,
            properties: {
                rating: { type: SchemaType.NUMBER, description: "Minimum rating value between 0 and 5" },
            },
            required: ["rating"],
        },
    },

    {
        name: "filterByStock",
        description: "Filter products that have at least the given number of units in stock.",
        parameters: {
            type: SchemaType.OBJECT,
            properties: {
                stock: { type: SchemaType.NUMBER, description: "Minimum stock count" },
            },
            required: ["stock"],
        },
    },

    {
        name: "filterByPriceAndRating",
        description: "Filter products by both a price range and a minimum rating.",
        parameters: {
            type: SchemaType.OBJECT,
            properties: {
                minPrice: { type: SchemaType.NUMBER, description: "Minimum price in USD" },
                maxPrice: { type: SchemaType.NUMBER, description: "Maximum price in USD" },
                rating: { type: SchemaType.NUMBER, description: "Minimum rating" },
            },
            required: ["minPrice", "maxPrice", "rating"],
        },
    },

    {
        name: "filterByPriceAndStock",
        description: "Filter products by price range and minimum stock level.",
        parameters: {
            type: SchemaType.OBJECT,
            properties: {
                minPrice: { type: SchemaType.NUMBER, description: "Minimum price in USD" },
                maxPrice: { type: SchemaType.NUMBER, description: "Maximum price in USD" },
                stock: { type: SchemaType.NUMBER, description: "Minimum stock count" },
            },
            required: ["minPrice", "maxPrice", "stock"],
        },
    },

    {
        name: "filterByRatingAndStock",
        description: "Filter products by a minimum rating and minimum stock level.",
        parameters: {
            type: SchemaType.OBJECT,
            properties: {
                rating: { type: SchemaType.NUMBER, description: "Minimum rating" },
                stock: { type: SchemaType.NUMBER, description: "Minimum stock count" },
            },
            required: ["rating", "stock"],
        },
    },

    {
        name: "filterByPriceAndRatingAndStock",
        description: "Filter products by price range, minimum rating, and minimum stock level all at once.",
        parameters: {
            type: SchemaType.OBJECT,
            properties: {
                minPrice: { type: SchemaType.NUMBER, description: "Minimum price in USD" },
                maxPrice: { type: SchemaType.NUMBER, description: "Maximum price in USD" },
                rating: { type: SchemaType.NUMBER, description: "Minimum rating" },
                stock: { type: SchemaType.NUMBER, description: "Minimum stock count" },
            },
            required: ["minPrice", "maxPrice", "rating", "stock"],
        },
    },
];