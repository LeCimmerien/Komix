import { pgTable, uuid, varchar, date, text, timestamp, primaryKey, char, integer } from 'drizzle-orm/pg-core';
import type { HashedPassword } from '../../auth';

export const user = pgTable('user', {
    id: uuid().defaultRandom().primaryKey(),
    username: varchar({ length: 50 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    passwordHash: text().$type<HashedPassword>().notNull(),
    createdAt: date({ mode: "date" }).defaultNow(),
    deletedAt: date({ mode: "date" })
});

export const project = pgTable('project', {
    id: uuid().defaultRandom().primaryKey(),
    author: uuid().notNull().references(() => user.id),
    name: char({length: 50}).notNull(),
    description: text().notNull(),
    createdAt: date({ mode: "date" }).defaultNow(),
    deletedAt: date({ mode: "date" })
})

export const chapter = pgTable('chapter', {
    id: uuid().defaultRandom().primaryKey(),
    projectId: uuid().notNull().references(() => project.id),
    title: varchar({ length: 255 }).notNull(),
    number: integer().notNull(),
    imagePath: text().notNull(),
    createdAt: date({ mode: "date" }).defaultNow(),
    deletedAt: date({ mode: "date" })
})

export const userSubscriptions = pgTable('user_subscriptions', {
  userId: uuid().notNull().references(() => user.id),
  projectId: uuid().notNull().references(() => project.id),
  subscribedAt: timestamp().defaultNow(),
}, (table) => [
  primaryKey({ columns: [table.userId, table.projectId] })
]);
