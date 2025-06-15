import { sql } from 'drizzle-orm';
import {
    sqliteTable,
    text,
    integer
} from 'drizzle-orm/sqlite-core';
import { habits } from './habits';
import { users } from './users';

export const habit_entries = sqliteTable('habit_entries', {
    id: text('id').primaryKey(),
    user_id: text('user_id').notNull().references(() => users.id),
    habit_id: text('habit_id').notNull().references(() => habits.id),
    created_at: text('created_at').notNull().default(sql`(current_timestamp)`),
    completed: integer('completed', { mode: "boolean" }).notNull().default(false),
});
export type HabitEntry = typeof habit_entries.$inferSelect;
export type NewHabitEntry = typeof habit_entries.$inferInsert;