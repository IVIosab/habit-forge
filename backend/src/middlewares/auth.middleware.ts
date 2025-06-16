import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { findUserById } from "../db/queries/users.query.js";

const JWT_SECRET = process.env.JWT_SECRET || "your_default_secret";

// Authentication middleware
export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies?.token;

    if (!token) {
        res.status(401).json({ message: "Unauthorized: No token provided." });
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
        const user = await findUserById(decoded.id);

        if (!user) {
            res.status(401).json({ message: "Unauthorized: User not found." });
            return;
        }

        req.user = {
            id: user.id,
            email: user.email,
        };

        next();
    } catch (err) {
        res.status(401).json({ message: "Unauthorized: Invalid token." });
        return;
    }
}
