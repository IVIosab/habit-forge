import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { findUserById } from "../db/queries/users.query.js";

const JWT_SECRET = process.env.JWT_SECRET || "your_default_secret";

// Extend Express Request to include `user` field 
// TODO: Move it to index.d.ts 
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
            };
        }
    }
}

// Authentication middleware
export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided." });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
        const user = await findUserById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: "Unauthorized: User not found." });
        }

        req.user = {
            id: user.id,
            email: user.email,
        };

        next();
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized: Invalid token." });
    }
}
