import { GoogleGenerativeAI } from "@google/generative-ai";
import { functionDefinitions } from "./ai.definitions.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
// const models = [
//     "gemini-2.5-flash",        // best balance
//     "gemini-3.1-flash-lite",  // higher daily limit
//     "gemini-2.5-flash-lite"   // fallback
// ];
export const createChatModel = () => {
    return genAI.getGenerativeModel({
        model: "gemini-2.5-flash",

        // 🔥 THIS connects AI → your functions
        tools: [
            {
                functionDeclarations: functionDefinitions
            }
        ],

        // 🔥 THIS controls AI behavior (MOST IMPORTANT PART)
        systemInstruction: `
You are an AI shopping assistant for an ecommerce website.

RULES:
- ALWAYS call "searchProducts" when user asks for products
- NEVER make up products — only use function results
- ALWAYS show product name, price, and image
- AFTER showing results, ask user which one they want
- ONLY call "addToCart" AFTER user confirms

SELECTION RULES:
- "first one" → index 1
- "second one" → index 2
- "Samsung one" → match by name

EDGE CASES:
- If no products found → say "No products found, try changing filters"
- If user is unclear → ask a clarifying question

STYLE:
- Short responses
- Friendly tone
- Clean formatting
`
    });
};