import { sql } from "drizzle-orm"
import { sqliteTable, text } from "drizzle-orm/sqlite-core"
import { user } from "../auth"

export const habits = sqliteTable("habits", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  priority: text("priority").notNull().default("none"),
  creation_date: text("creation_date")
    .notNull()
    .default(sql`(current_timestamp)`),
  user_id: text("user_id")
    .notNull()
    .references(() => user.id)
})
