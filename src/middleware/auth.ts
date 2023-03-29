import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config";

export const auth = (req: Request, res: Response, next: NextFunction) => {
    next();
}
