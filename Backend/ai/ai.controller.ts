import { Response } from "express";
import { createChatModel } from "./ai.service.js";
import { aiFunctionExecutors } from "./ai.functions.js";

export const chatWithAI = async (req: any, res: Response) => {
    try {
        const { message, history = [] } = req.body;
        const userId = req.user._id;

        const model = createChatModel();
        const chat  = model.startChat({ history });

        const result   = await chat.sendMessage(message);
        const response = result.response;

        const part = response.candidates?.[0]?.content?.parts?.[0];

        // ── Function call branch ─────────────────────────────
        if (part?.functionCall) {
            const { name, args } = part.functionCall;

            const executor = aiFunctionExecutors[name as keyof typeof aiFunctionExecutors];
            if (!executor) {
                return res.status(400).json({ message: `Unknown AI function: ${name}` });
            }

            const data = await (executor as Function)(args, userId.toString());

            // Send function result back to the model for a natural language reply
            const final = await chat.sendMessage([
                {
                    functionResponse: {
                        name,
                        response: { result: data },
                    },
                },
            ]);

            return res.json({
                type:           "data",
                functionCalled: name,
                data,
                message:        final.response.text(),
            });
        }

        // ── Plain text reply ─────────────────────────────────
        return res.json({
            type:    "text",
            message: response.text(),
        });

    } catch (error: any) {
        console.error("❌ AI chat error:", error);
        return res.status(500).json({ message: error.message || "AI service error" });
    }
};