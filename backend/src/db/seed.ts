import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";

import { habits, habit_entries, users } from "./schema";

const sqlite = new Database("./src/db/sqlite.db");
const db = drizzle(sqlite, { schema: { habits, habit_entries, users } });

//insert a user
const user = {
    id: "1",
    email: "1@1.com",
    hashedPassword: "1",
};

const result = await db.insert(users).values(user).returning();
console.log(result);
