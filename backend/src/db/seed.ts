import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";

import { habits, habit_entries, users } from "./schema";

const sqlite = new Database("./src/db/sqlite.db");
const db = drizzle(sqlite, { schema: { habits, habit_entries, users } });

//insert a user
const user = {
    id: "EXAMPLE_USER_ID",
    email: "example@gmail.com",
    hashedPassword: "password",
};

await db.insert(users).values(user);


//insert a habit
const habit = {
    id: "EXAMPLE_HABIT_ID",
    name: "Example Habit",
    user_id: "EXAMPLE_USER_ID",
};

await db.insert(habits).values(habit);


//insert an entry
const entry = {
    id: "EXAMPLE_ENTRY_ID",
    user_id: "EXAMPLE_USER_ID",
    habit_id: "EXAMPLE_HABIT_ID",
    created_at: "2023-01-01",
    completed: true,
};

await db.insert(habit_entries).values(entry);