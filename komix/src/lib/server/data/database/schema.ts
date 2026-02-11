import { pgTable, uuid, varchar, date, text} from 'drizzle-orm/pg-core';
import type { HashedPassword } from '../../auth';

export const user = pgTable('user', {
    id: uuid().defaultRandom().primaryKey(),
    username: varchar({ length: 50 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    passwordHash: text().$type<HashedPassword>().notNull(),
    createdAt: date({ mode: "date" }).defaultNow(),
    deletedAt: date({ mode: "date" })
});
