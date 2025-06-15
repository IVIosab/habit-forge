import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { habits, habit_entries, users } from "./schema";

const sqlite = new Database("./src/db/sqlite.db");
export const db = drizzle(sqlite, { schema: { habits, habit_entries, users } });
