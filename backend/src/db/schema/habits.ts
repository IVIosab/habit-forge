import { sql } from 'drizzle-orm';
import {
    sqliteTable,
    text,
} from 'drizzle-orm/sqlite-core';
import { users } from './users';

export const habits = sqliteTable('habits', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    created_at: text('created_at').notNull().default(sql`(current_timestamp)`),
    user_id: text('user_id').notNull().references(() => users.id),
});
