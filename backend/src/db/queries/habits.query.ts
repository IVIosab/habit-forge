import { db } from "../index.js"
import { habits } from "../schema/api/habits.js"
import { eq } from "drizzle-orm"

export async function dbGetUserHabits(userId: any) {
  const res = await db.select().from(habits).where(eq(habits.user_id, userId))

  return res
}

export async function dbGetHabitById(habitId: string) {
  const res = await db.select().from(habits).where(eq(habits.id, habitId))

  return res[0]
}

export async function dbCreateUserHabit(
  userId: any,
  title: string,
  description: any,
  priority: any
) {
  const habit = {
    id: crypto.randomUUID(),
    user_id: userId,
    title,
    ...(description && { description }),
    ...(priority && { priority })
  }

  const res = await db.insert(habits).values(habit).returning()

  return res
}

export async function dbUpdateHabitById(
  habitId: string,
  title: string,
  description: any,
  priority: any
) {
  const res = await db
    .update(habits)
    .set({
      title,
      ...(description && { description }),
      ...(priority && { priority })
    })
    .where(eq(habits.id, habitId))
    .returning()

  return res
}

export async function dbDeleteHabitById(habitId: string) {
  const res = await db.delete(habits).where(eq(habits.id, habitId)).returning()

  return res
}
