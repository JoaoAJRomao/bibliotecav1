import { integer, pgTable, varchar, timestamp, index } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    password: varchar({ length: 255 }).notNull(),
    role: varchar({ length: 50 }).default("user").notNull(), // "admin" | "user"
});

export const booksTable = pgTable("books", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    title: varchar({ length: 255 }).notNull(),
    author: varchar({ length: 255 }).notNull(),
    year: integer().notNull(),
    publisher: varchar({ length: 255 }).notNull(),
    quantity: integer().default(1).notNull(), // Quantidade total de cópias
});

export const loansTable = pgTable("loans", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
    bookId: integer("book_id").notNull().references(() => booksTable.id, { onDelete: "cascade" }),
    borrowedAt: timestamp("borrowed_at").defaultNow().notNull(),
    returnedAt: timestamp("returned_at"),
}, (table) => [
    index("loans_user_id_idx").on(table.userId),
    index("loans_book_id_returned_idx").on(table.bookId, table.returnedAt),
]);