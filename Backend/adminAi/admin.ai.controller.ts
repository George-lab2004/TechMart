import { Request, Response } from "express";
import { createAdminChatModel } from "./admin.ai.service.js";
import { adminAiFunctions } from "./admin.ai.functions.js";
import { AdminAIChatRequest } from "./admin.ai.types.js";
import User from "../Models/userModel.js";

export const chatWithAdminAI = async (req: Request, res: Response): Promise<void> => {
    try {
        const { message, history, lastResults, isSystemMessage } = req.body as AdminAIChatRequest;

        const model = createAdminChatModel();
        
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

        const chat = model.startChat({ history: formattedHistory });
        const result = await chat.sendMessage(message);
        const response = await result.response;
        const functionCalls = response.functionCalls();

        // Update User Stats (Shared for all success paths)
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

        // 1) Model requested a function call
        if (functionCalls && functionCalls.length > 0) {
            const call = functionCalls[0];
            console.log(`🤖 [Admin AI] Function Called: ${call.name}`, call.args);

            if (call.name in adminAiFunctions) {
                const executor = adminAiFunctions[call.name as keyof typeof adminAiFunctions];
                const fnResult = await executor(call.args);

                // If Gemini decides to render a chart, we intercept it and signal the frontend
                if (call.name === "renderChart") {
                    res.json({
                        role: "model",
                        parts: [{ text: "Here is your chart." }],
                        functionCalled: call.name,
                        data: fnResult,
                        message: "Here is your chart.",
                    });
                    return;
                }

                // Standard loop: sending database results back so frontend can pass it to Gemini again
                res.json({
                    role: "model",
                    parts: [{ text: "Analyzed data." }], 
                    functionCalled: call.name,
                    data: fnResult,
                    message: "Analyzed data.",
                });
                return;
            } else {
                res.status(400).json({ error: "Unknown admin function requested." });
                return;
            }
        }

        // 2) The final natural language response (text)
        res.json({
            role: "model",
            parts: [{ text: response.text() }],
            message: response.text(),
        });

    } catch (error: any) {
        console.error("Admin AI Error:", error);
        
        const errMsg = error.message?.toLowerCase() || "";
        const isQuota = errMsg.includes("429") || errMsg.includes("quota") || errMsg.includes("retry") || error.status === 429;
        const isOverloaded = errMsg.includes("503") || errMsg.includes("overloaded") || error.status === 503;

        if (isQuota) {
            res.status(429).json({ 
                error: "QUOTA_EXHAUSTED",
                message: "TechMart AI is out of daily messages right now. Try again tomorrow!" 
            });
            return;
        }

        if (isOverloaded) {
            res.status(503).json({ 
                error: "MODEL_OVERLOADED",
                message: "The TechMart AI is currently seeing extra high volume. Please give it a minute to catch its breath and try your request again!" 
            });
            return;
        }

        res.status(500).json({ error: error.message || "Failed to communicate with Admin AI." });
    }
};
