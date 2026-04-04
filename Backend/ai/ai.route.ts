import express from "express";
import { protect } from "../Middleware/authMiddleware.js";
import { chatWithAI } from "./ai.controller.js";
import { aiLimiter } from "../Middleware/Limiter.js";

const AIrouter = express.Router();

AIrouter.post("/chat", protect, aiLimiter, chatWithAI);

export default AIrouter;