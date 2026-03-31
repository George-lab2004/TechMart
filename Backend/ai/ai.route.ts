import express from "express";
import { protect } from "../Middleware/authMiddleware.js";
import { chatWithAI } from "./ai.controller.js";

const AIrouter = express.Router();

AIrouter.post("/chat", protect, chatWithAI);

export default AIrouter;