import { eq, and } from "drizzle-orm";
import { db } from "../index.js";
import { habit_entries } from "../schema/api/habit_entries.js";

// 1. Get all entries
export async function getAllEntries() {
  return db.select().from(habit_entries);
}

// 3. Get a single entry by ID
export async function getEntry(entryId: string) {
  const result = await db
    .select()
    .from(habit_entries)
    .where(eq(habit_entries.id, entryId));

  return result[0] ?? null;
}

// 4. Create or replace an entry for a specific habit, date, and user
export async function createEntryForHabit(
  userId: string,
  habitId: string,
  completed: boolean
) {
  const entry = {
    id: crypto.randomUUID(),
    user_id: userId,
    habit_id: habitId,
    completed,
  };

  const result = await db.insert(habit_entries).values(entry).returning();
  return result[0];
}

// 5. Update entry by ID (completed status)
export async function updateEntry(entryId: string, completed: boolean) {
  const result = await db
    .update(habit_entries)
    .set({ completed })
    .where(eq(habit_entries.id, entryId))
    .returning();

  return result[0] ?? null;
}

// 6. Delete entry by ID
export async function deleteEntry(entryId: string) {
  const result = await db
    .delete(habit_entries)
    .where(eq(habit_entries.id, entryId))
    .returning();

  return result[0] ?? null;
}
