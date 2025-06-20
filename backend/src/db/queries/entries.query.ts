import { eq, and } from "drizzle-orm"
import { db } from "../index.js"
import { entries } from "../schema/api/entries.js"

export async function dbGetUserEntries(userId: any) {
  const res = await db.select().from(entries).where(eq(entries.user_id, userId))

  return res
}

export async function dbGetEntryById(entryId: string) {
  const res = await db.select().from(entries).where(eq(entries.id, entryId))

  return res[0] ?? null
}

export async function dbCreateUserHabitEntry(user_id: any, habit_id: string) {
  const entry = {
    id: crypto.randomUUID(),
    user_id,
    habit_id
  }

  const res = await db.insert(entries).values(entry).returning()

  return res
}

export async function dbDeleteEntryById(entryId: string) {
  const res = await db
    .delete(entries)
    .where(eq(entries.id, entryId))
    .returning()

  return res
}
