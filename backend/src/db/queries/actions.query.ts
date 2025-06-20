import { eq, and, sql, isNull } from "drizzle-orm"
import { db } from "../index.js"
import { habits, entries } from "../schema/api"

export async function dbGetUserIncompleteHabits(userId: any) {
  const today = new Date().toISOString().slice(0, 10) // 'YYYY-MM-DD'

  const res = await db
    .select()
    .from(habits)
    .leftJoin(
      entries,
      and(
        eq(entries.habit_id, habits.id),
        eq(entries.user_id, userId),
        sql`DATE(${entries.completion_date}) = ${today}`
      )
    )
    .where(and(eq(habits.user_id, userId), isNull(entries.id)))

  return res
}

export async function dbGetUserCompleteHabits(userId: any) {
  const today = new Date().toISOString().slice(0, 10) // 'YYYY-MM-DD'

  const res = await db
    .select()
    .from(habits)
    .innerJoin(
      entries,
      and(
        eq(entries.habit_id, habits.id),
        eq(entries.user_id, userId),
        sql`DATE(${entries.completion_date}) = ${today}`
      )
    )
    .where(eq(habits.user_id, userId))

  return res
}
