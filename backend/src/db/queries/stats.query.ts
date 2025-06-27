import { eq } from "drizzle-orm"
import { db } from "../index.js"
import { entries } from "../schema/api/entries.js"

export async function dbGetStatsForHabit(habitId: string) {
  const result = await db
    .select({ completion_date: entries.completion_date })
    .from(entries)
    .where(eq(entries.habit_id, habitId))

  return result.map((r) => r.completion_date)
}
