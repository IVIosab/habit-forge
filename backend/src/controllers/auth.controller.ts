import { Request, Response } from "express";
import { hashPassword, comparePassword, generateToken } from "../utils/auth.js";
import { db } from "../db/index.js";
import { users } from "../db/schema/users.js";
import { eq } from "drizzle-orm";
import { createUser, findUserByEmail } from "../db/queries/users.query.js";

// POST /auth/register
export async function register(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ message: "Email and password are required." });
        return;
    }

    const existing = await db.select().from(users).where(eq(users.email, email));
    if (existing.length > 0) {
        res.status(409).json({ message: "User already exists." });
        return;
    }

    const hashed = await hashPassword(password);
    const newUser = {
        id: crypto.randomUUID(),
        email,
        hashedPassword: hashed,
    };

    const user = await createUser(newUser);

    const token = generateToken(user.id);

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({ user: { id: user.id, email: user.email } });
}

// POST /auth/login
export async function login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ message: "Email and password are required." });
        return;
    }

    const user = await findUserByEmail(email);
    if (!user || !(await comparePassword(password, user.hashedPassword))) {
        res.status(401).json({ message: "Invalid credentials." });
        return;
    }

    const token = generateToken(user.id);

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ user: { id: user.id, email: user.email } });
}

// LOGOUT (optional)
export function logout(_: Request, res: Response): void {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully." });
}