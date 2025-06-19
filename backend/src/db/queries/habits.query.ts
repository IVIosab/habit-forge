import { db } from "../index.js";
import { habits } from "../schema/api/habits.js";
import { eq } from "drizzle-orm";

// GET all habits for a user
export async function getHabitsByUser(userId: string) {
  return db.select().from(habits).where(eq(habits.user_id, userId));
}

// POST create habit
export async function createHabitForUser(userId: string, name: string) {
  const newHabit = {
    id: crypto.randomUUID(),
    name,
    user_id: userId,
    // created_at will default to current_timestamp
  };

  const result = await db.insert(habits).values(newHabit).returning();
  return result[0];
}

// GET habit by ID
export async function getHabit(habitId: string) {
  const result = await db.select().from(habits).where(eq(habits.id, habitId));
  return result[0];
}

// PUT update habit name
export async function updateHabitById(habitId: string, name: string) {
  const result = await db
    .update(habits)
    .set({ name })
    .where(eq(habits.id, habitId))
    .returning();

  return result[0];
}

// DELETE habit
export async function deleteHabitById(habitId: string) {
  await db.delete(habits).where(eq(habits.id, habitId));
}
