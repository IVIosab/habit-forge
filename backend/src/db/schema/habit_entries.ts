import { sql } from 'drizzle-orm';
import {
    sqliteTable,
    text,
    integer
} from 'drizzle-orm/sqlite-core';
import { habits } from './habits';

export const habit_entries = sqliteTable('habit_entries', {
    id: text('id').primaryKey(),
    habit_id: text('habit_id').notNull().references(() => habits.id),
    created_at: text('created_at').notNull().default(sql`(current_timestamp)`),
    completed: integer('completed', {mode: "boolean"}).notNull().default(false),
});
