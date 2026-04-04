import { FunctionDeclaration, SchemaType } from "@google/generative-ai";

export const functionDefinitions: FunctionDeclaration[] = [
    //Search 
    {
        name: "searchProducts",
        description: "Search products using filters like category, price range, processor, RAM, and keywords. Always call this first before addToCart, getProductDetails, removeFromCart, or updateCartQuantity to resolve a product name into a real ID.",
        parameters: {
            type: SchemaType.OBJECT,
            properties: {
                category: {
                    type: SchemaType.STRING,
                    description: "Product category e.g. 'phones', 'laptops'"
                },
                maxPrice: {
                    type: SchemaType.NUMBER,
                    description: "Maximum price in USD"
                },
                minPrice: {
                    type: SchemaType.NUMBER,
                    description: "Minimum price in USD"
                },
                processor: {
                    type: SchemaType.STRING,
                    description: "Processor name e.g. 'Intel i5', 'M2', 'M4'"
                },
                minRAM: {
                    type: SchemaType.NUMBER,
                    description: "Minimum RAM in GB"
                },
                keywords: {
                    type: SchemaType.STRING,
                    description: "General keyword search — product name, brand, or description"
                },
                brand: {
                    type: SchemaType.STRING,
                    description: "Brand name e.g. 'Apple', 'Sony', 'Samsung'"
                },
                minRating: {
                    type: SchemaType.NUMBER,
                    description: "Minimum product rating (0-5)"
                },
                limit: {
                    type: SchemaType.NUMBER,
                    description: "Max number of results to return, defaults to 5"
                },
            },
            required: [],
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
        name: "getTopSellingProducts",
        description: "Get the top-selling products in the store by sales volume.",
        parameters: {
            type: SchemaType.OBJECT,
            properties: {
                limit: {
                    type: SchemaType.NUMBER,
                    description: "Max number of results to return, defaults to 5"
                }
            },
            required: [],
        },
    },
    {
        name: "getExpectedLowStockProducts",
        description: "Get expected low stock products based on sales data the higher the sales the higher the chance of being low stock",
        parameters: {
            type: SchemaType.OBJECT,
            properties: {
                limit: {
                    type: SchemaType.NUMBER,
                    description: "Max number of results to return, defaults to 5"
                }
            },
            required: [],
        },
    },
    {
        name: "getLowestPerformingProducts",
        description: "get lowest performing products based on sales data the lower the sales the lower the chance of being low stock",
        parameters: {
            type: SchemaType.OBJECT,
            properties: {
                limit: {
                    type: SchemaType.NUMBER,
                    description: "Max number of results to return, defaults to 10"
                }
            },
            required: [],
        },
    },
    {
        name: "getRevenueSummaryStats",
        description: "Get total revenue, total orders, and average order value for a specific timeframe (e.g., last 7 days, last 30 days).",
        parameters: {
            type: SchemaType.OBJECT,
            properties: {
                daysBack: {
                    type: SchemaType.NUMBER,
                    description: "How many days back to calculate stats for (e.g., 7 or 30). Defaults to 30.",
                }
            },
            required: [],
        },
    },
    {
        name: "getRecentOrders",
        description: "Fetch the most recent orders placed by users to check fulfillment health and recent activity.",
        parameters: {
            type: SchemaType.OBJECT,
            properties: {
                limit: {
                    type: SchemaType.NUMBER,
                    description: "Max number of recent orders to fetch, defaults to 10"
                }
            },
            required: [],
        },
    },
    {
        name: "renderChart",
        description: "Use this to display a visual chart to the user. Call this AFTER you have fetched statistical data using other tools. Formats data for the Recharts React library.",
        parameters: {
            type: SchemaType.OBJECT,
            properties: {
                title: { type: SchemaType.STRING, description: "Title of the chart" },
                type: { type: SchemaType.STRING, description: "Type of chart: 'bar', 'line', or 'pie'" },
                data: {
                    type: SchemaType.ARRAY,
                    items: {
                        type: SchemaType.OBJECT,
                        properties: {
                            name: { type: SchemaType.STRING, description: "The label for the x-axis or pie slice (e.g. product name or date)" },
                            value: { type: SchemaType.NUMBER, description: "The numerical value for the y-axis" }
                        }
                    },
                    description: "Array of data points. MUST have 'name' and 'value' fields to map to the chart."
                }
            },
            required: ["title", "type", "data"],
        },
    }
]