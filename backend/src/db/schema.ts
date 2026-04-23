import { integer, pgTable, varchar, serial } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    password: varchar({ length: 255 }).notNull(),
});
export const booksTable = pgTable("books", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    title: varchar({ length: 255 }).notNull(),
    author: varchar({ length: 255 }).notNull(),
    year: integer().notNull(),
    publisher: varchar({ length: 255 }).notNull(),
    totalQuantity: integer("total_quantity").notNull().default(3),
    availableQuantity: integer("available_quantity").notNull().default(3),
});