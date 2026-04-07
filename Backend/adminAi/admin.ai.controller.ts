import { Request, Response } from "express";
import { createAdminChatModel } from "./admin.ai.service.js";
import { adminAiFunctions } from "./admin.ai.functions.js";
import { AdminAIChatRequest } from "./admin.ai.types.js";

export const chatWithAdminAI = async (req: Request, res: Response): Promise<void> => {
    try {
        const { message, history, lastResults } = req.body as AdminAIChatRequest;

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
        
        // Handle Gemini 15 RPM Rate Limiting elegantly
        const errMsg = error.message?.toLowerCase() || "";
        if (errMsg.includes("429") || errMsg.includes("quota") || errMsg.includes("retry") || error.status === 429) {
            res.status(429).json({ error: "Google AI is taking a breather! Free tier has a 15 messages per minute limit. Please wait 30 seconds before asking the next question." });
            return;
        }

        res.status(500).json({ error: error.message || "Failed to communicate with Admin AI." });
    }
};
