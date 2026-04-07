import { Response } from "express";
import { createChatModel } from "./ai.service.js";

export const chatWithAI = async (req: any, res: Response) => {
    // The fallback logic and Express response handling is now fully localized in ai.service.ts
    // Therefore, we just delegate the request directly.
    return createChatModel(req, res);
};