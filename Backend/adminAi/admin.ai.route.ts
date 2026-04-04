import express from "express";
import { protect, admin } from "../Middleware/authMiddleware.js";
import { chatWithAdminAI } from "./admin.ai.controller.js";
import { aiLimiter } from "../Middleware/Limiter.js";

const adminAiRouter = express.Router();

// This endpoint is fully protected! Only people with the Admin boolean can run it!
adminAiRouter.post("/chat", protect, admin, aiLimiter, chatWithAdminAI);

export default adminAiRouter;
