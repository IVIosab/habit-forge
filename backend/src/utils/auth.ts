import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret"; // Replace in prod

export function hashPassword(password: string) {
    return bcrypt.hash(password, 10);
}

export function comparePassword(password: string, hashed: string) {
    return bcrypt.compare(password, hashed);
}

export function generateToken(userId: string) {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): { userId: string } {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
}
