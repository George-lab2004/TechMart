import { IUser } from "../Models/userModel.js";

declare global {
  namespace Express {
    interface Request {
      user?: IUser | null;
    }
  }
}
