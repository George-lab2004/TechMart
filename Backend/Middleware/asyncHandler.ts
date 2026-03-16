import { Request, Response, NextFunction, RequestHandler } from "express"
import { Request, Response, NextFunction, RequestHandler } from "express.js"

type AsyncFn = (req: Request, res: Response, next: NextFunction) => Promise<void>

export const asyncHandler = (fn: AsyncFn): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
