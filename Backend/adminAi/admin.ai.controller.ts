import { Request, Response } from "express";
import { createAdminModelInstance, ADMIN_MODELS, sleep } from "./admin.ai.service.js";
import { adminAiFunctions } from "./admin.ai.functions.js";
import { AdminAIChatRequest } from "./admin.ai.types.js";
import User from "../Models/userModel.js";

export const chatWithAdminAI = async (req: Request, res: Response): Promise<void> => {
    const { message, history, lastResults, isSystemMessage } = req.body as AdminAIChatRequest;

    const formattedHistory = history.map((msg) => ({
        role: msg.role,
        parts: msg.parts.map(p => ({ text: p.text || "" })),
    }));

    if (lastResults && lastResults.length > 0) {
        formattedHistory.push({
            role: "user",
            parts: [{ text: `[Internal Context - Database Tool Results]: \n${JSON.stringify(lastResults, null, 2)}` }],
        });
    }

    // ── Fallback loop (same pattern as consumer AI) ──────────────
    let modelIndex = 0;
    let lastError: any = null;

    while (modelIndex < ADMIN_MODELS.length) {
        const currentModel = ADMIN_MODELS[modelIndex];

        try {
            const model = createAdminModelInstance(currentModel);
            const chat = model.startChat({ history: formattedHistory });
            const result = await chat.sendMessage(message);
            const response = result.response;
            const functionCalls = response.functionCalls();

            // ── Update User Stats ────────────────────────────────────
            if (!isSystemMessage) {
                try {
                    await User.findByIdAndUpdate((req as any).user._id, {
                        $inc: { aiUsageCount: 1 },
                        $set: { lastAiMessage: message }
                    });
                } catch (statError) {
                    console.error("[Admin AI Stats] Failed to update user usage:", statError);
                }
            }

            // ── Function call branch ─────────────────────────────────
            if (functionCalls && functionCalls.length > 0) {
                const call = functionCalls[0];
                console.log(`🤖 [Admin AI] Function Called: ${call.name} (model: ${currentModel})`, call.args);

                if (call.name in adminAiFunctions) {
                    const executor = adminAiFunctions[call.name as keyof typeof adminAiFunctions];
                    const fnResult = await executor(call.args);

                    // Chart intercept — signal frontend directly
                    if (call.name === "renderChart") {
                        res.json({
                            role: "model",
                            parts: [{ text: "Here is your chart." }],
                            functionCalled: call.name,
                            data: fnResult,
                            message: "Here is your chart.",
                            model: currentModel,
                        });
                        return;
                    }

                    // Standard function result → frontend re-sends to Gemini
                    res.json({
                        role: "model",
                        parts: [{ text: "Analyzed data." }],
                        functionCalled: call.name,
                        data: fnResult,
                        message: "Analyzed data.",
                        model: currentModel,
                    });
                    return;
                } else {
                    res.status(400).json({ error: "Unknown admin function requested." });
                    return;
                }
            }

            // ── Plain text branch ────────────────────────────────────
            res.json({
                role: "model",
                parts: [{ text: response.text() }],
                message: response.text(),
                model: currentModel,
            });
            return;

        } catch (err: any) {
            lastError = err;

            const isQuota = err?.status === 429 || err?.message?.includes("429") || err?.message?.toLowerCase().includes("quota");
            const isOverloaded = err?.status === 503 || err?.message?.includes("503") || err?.message?.toLowerCase().includes("overloaded");
            const isNotFound = err?.status === 404 || err?.message?.toLowerCase().includes("not found");

            if (isQuota || isOverloaded) {
                if (modelIndex < ADMIN_MODELS.length - 1) {
                    console.warn(`[Admin AI] ${currentModel} ${isQuota ? 'rate limited' : 'overloaded'} → falling back to ${ADMIN_MODELS[modelIndex + 1]}`);
                    modelIndex++;
                    await sleep(500);
                    continue;
                }
                lastError = new Error(isQuota ? "QUOTA_EXHAUSTED" : "MODEL_OVERLOADED");
                break;
            }

            if (isNotFound) {
                console.error(`[Admin AI] Model "${currentModel}" not found → skipping`);
                modelIndex++;
                continue;
            }

            // Unknown error — don't retry
            break;
        }
    }

    // ── All models exhausted ─────────────────────────────────────
    console.error("[Admin AI] All models failed:", lastError?.message);

    if (lastError?.message === "QUOTA_EXHAUSTED") {
        res.status(429).json({
            error: "QUOTA_EXHAUSTED",
            message: "TechMart AI is out of daily messages right now. Try again tomorrow!"
        });
        return;
    }

    if (lastError?.message === "MODEL_OVERLOADED") {
        res.status(503).json({
            error: "MODEL_OVERLOADED",
            message: "The TechMart AI is currently seeing extra high volume. Please give it a minute to catch its breath and try your request again!"
        });
        return;
    }

    res.status(500).json({
        error: lastError?.message || "Failed to communicate with Admin AI."
    });
};
