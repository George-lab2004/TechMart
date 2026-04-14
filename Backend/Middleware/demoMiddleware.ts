import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "./asyncHandler.js";
import { IUser } from "../Models/userModel.js";

interface CustomRequest extends Request {
    user?: IUser | null;
}

/**
 * Middleware to restrict destructive actions (PUT, DELETE, certain POST)
 * for the public Demo Admin account.
 */
export const demoGuard = asyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
    // Identity of the protected demo account
    const DEMO_EMAIL = "admin@techmart.dev";

    if (req.user && req.user.email === DEMO_EMAIL) {
        const method = req.method.toUpperCase();
        
        // Block DELETE and PUT (Updates)
        if (method === "DELETE" || method === "PUT") {
            res.status(403);
            throw new Error("Action restricted in Demo Mode! 🔒 This account is for presentation only to protect the integrity of the master catalog. Feel free to explore!");
        }

        // Optional: Block certain POST requests that aren't searches 
        // (Like creating a real user or a real product in the DB)
        // Note: Frontend will handle 'Add Product' by using localStorage, 
        // but this is the backend fallback.
        const path = req.path.toLowerCase();
        if (method === "POST" && !path.includes("chat") && !path.includes("login")) {
             res.status(403);
             throw new Error("Action restricted in Demo Mode! 🔒 This account is for presentation only to protect the integrity of the master catalog. Feel free to explore!");
        }
    }

    next();
});
