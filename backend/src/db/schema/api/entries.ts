import { sql } from "drizzle-orm"
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"
import { habits } from "./habits"
import { user } from "../auth"

export const entries = sqliteTable("entries", {
  id: text("id").primaryKey(),
  completion_date: text("completion_date")
    .notNull()
    .default(sql`(current_timestamp)`),
  user_id: text("user_id")
    .notNull()
    .references(() => user.id),
  habit_id: text("habit_id")
    .notNull()
    .references(() => habits.id)
})
