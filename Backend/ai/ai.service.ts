import { GoogleGenerativeAI } from "@google/generative-ai";
import { functionDefinitions } from "./ai.definitions.js";
import { aiFunctionExecutors } from "./ai.functions.js";
import { Response } from "express";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const MODELS = [
  "gemini-3.1-flash-lite",
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash",
  "gemini-3-flash"
] as const;

const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

const SYSTEM_INSTRUCTION = `
You are TechMart's AI Shopping Expert. TechMart is a premium electronics and luxury tech store.

═══════════════════════════════════════════
YOUR MISSION & IDENTITY
═══════════════════════════════════════════

1. MISSION: Your sole mission is to guide users through TechMart's premium catalog, act as a knowledgeable tech consultant, and manage their shopping experience flawlessly.
2. IDENTITY: You are an expert on modern hardware. You speak with authority and enthusiasm about tech specs, design, and performance, but ONLY when those details come from TechMart's database.
3. LOYALTY: You are loyal only to TechMart. You do not know about, mention, or recommend products from other stores or brands that are not in our database.

═══════════════════════════════════════════
GOLDEN RULES — NEVER BREAK THESE
═══════════════════════════════════════════

1. NEVER ask the user for a product ID. Users do not know IDs.
   - Always resolve names to IDs using searchProducts or searchByIntent first.
   - [Internal Context] in your history contains the exact IDs of products recently discussed.

2. STRICTURE SCOPE: The TechMart catalog is the ONLY world that exists.
   - If searchProducts returns "found: false" or an empty list, the product IS NOT in our store.
   - You MUST say: "I'm sorry, we don't carry that specific item in the TechMart catalog right now."
   - NEVER suggest a product from your general training data if it is not returned by a function call.
   - NEVER invent specs or prices. Only use data returned by function calls.

3. NO EXTERNAL KNOWLEDGE: Do not talk about products, models, or versions released "outside" of what our search results show. If the store only carries iPhone 15, do not discuss iPhone 16.

4. AUTOMATIC EXECUTION: If a user asks to add to cart, check out, or remove an item, and you have the ID, CALL THE FUNCTION IMMEDIATELY. Do not ask "Would you like me to do that?". Just do it and confirm.

═══════════════════════════════════════════
SEARCH & RECOMMENDATION RULES
═══════════════════════════════════════════

- Specific product query → call searchProducts
- Emotional or broad intent ("vibe for a creative studio", "best for gaming") → call searchByIntent
- When results are found: Don't just list them. Be an expert. "I found the [Name], it's a powerhouse for [Specific Use Case from Specs]."
- Always show: name · brand · price · stock status.

═══════════════════════════════════════════
CART & ORDER MANAGEMENT
═══════════════════════════════════════════

- Removing/Updating: Always call viewCart first to ensure you have the correct current ID.
- Checkout: Call checkoutCart when the user is ready to pay. Tell them they are being redirected to the secure checkout page to complete their order.

═══════════════════════════════════════════
RESPONSE STYLE (THE EXPERT PERSONA)
═══════════════════════════════════════════

- BE EXPRESSIVE: You have the space to speak freely as a tech consultant. Instead of "Here is a laptop", say "The [Name] is an absolute beast for [User's Goal] thanks to its [Spec]."
- STAY RELEVANT: All your "free speech" must remain 100% focused on TechMart products and the user's mission.
- NO WAFFLING: Be descriptive but efficient.
- Use line breaks to make product lists readable.
- Format prices as $X,XXX.
- If the user says hello or asks how you are, respond warmly as a high-end concierge.
`;

const createModelInstance = (model: string) =>
  genAI.getGenerativeModel({
    model,
    tools: [{ functionDeclarations: functionDefinitions }],
    systemInstruction: SYSTEM_INSTRUCTION,
  });

export const createChatModel = async (req: any, res: Response) => {
  const { message, history = [] } = req.body;
  const userId = req.user._id;

  let modelIndex = 0;
  let lastError: any = null;

  while (modelIndex < MODELS.length) {
    const currentModel = MODELS[modelIndex];

    try {
      const instance = createModelInstance(currentModel);
      const chat = instance.startChat({ history });
      const result = await chat.sendMessage(message);
      const response = result.response;
      const part = response.candidates?.[0]?.content?.parts?.[0];

      // ── Function call branch ──────────────────────────────────────
      if (part?.functionCall) {
        const { name, args } = part.functionCall;

        const executor = aiFunctionExecutors[name as keyof typeof aiFunctionExecutors];
        if (!executor) {
          return res.status(400).json({ message: `Unknown AI function: ${name}` });
        }

        const data = await (executor as Function)(args, userId.toString());

        const final = await chat.sendMessage([{
          functionResponse: {
            name,
            response: { result: data },
          },
        }]);

        return res.json({
          type: "data",
          functionCalled: name,
          data,
          message: final.response.text(),
          model: currentModel,
        });
      }

      // ── Plain text branch ─────────────────────────────────────────
      return res.json({
        type: "text",
        message: response.text(),
        model: currentModel,
      });

    } catch (err: any) {
      lastError = err;

      const isQuota = err?.status === 429 || err?.message?.includes("429") || err?.message?.toLowerCase().includes("quota");
      const isOverloaded = err?.status === 503 || err?.message?.includes("503") || err?.message?.toLowerCase().includes("overloaded");
      const isNotFound = err?.status === 404 || err?.message?.toLowerCase().includes("not found");

      if (isQuota || isOverloaded) {
        if (modelIndex < MODELS.length - 1) {
          console.warn(`[AI] ${currentModel} ${isQuota ? 'rate limited' : 'overloaded'} → falling back to ${MODELS[modelIndex + 1]}`);
          modelIndex++;
          await sleep(500); // Tiny pause before fallback
          continue;
        }
        // All models exhausted
        lastError = new Error(isQuota ? "QUOTA_EXHAUSTED" : "MODEL_OVERLOADED");
        break;
      }

      if (isNotFound) {
        console.error(`[AI] Model "${currentModel}" not found → skipping`);
        modelIndex++;
        continue;
      }

      // Any other error — don't retry
      break;
    }
  }

  console.error("[AI] All models failed:", lastError?.message);

  if (lastError?.message === "QUOTA_EXHAUSTED") {
    return res.status(429).json({
      message: "TechMart AI is out of daily messages right now. Try again tomorrow!",
      error: "QUOTA_EXHAUSTED"
    });
  }

  if (lastError?.message === "MODEL_OVERLOADED") {
    return res.status(503).json({
      message: "The TechMart AI is currently seeing extra high volume. Please give it a minute to catch its breath and try your request again!",
      error: "MODEL_OVERLOADED"
    });
  }

  return res.status(500).json({
    message: lastError?.message || "AI service is temporarily unavailable. Please try again.",
  });
};