import { db } from "../index.js";
import { users } from "../schema/users.js";
import { eq } from "drizzle-orm";

type CreateUserInput = {
    id: string;
    email: string;
    hashedPassword: string;
};

// Create a new user
export async function createUser(data: CreateUserInput) {
    const result = await db.insert(users).values(data).returning();
    return result[0];
}

// Find a user by email
export async function findUserByEmail(email: string) {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0] ?? null;
}

// Optional: Find a user by ID
export async function findUserById(id: string) {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0] ?? null;
}
