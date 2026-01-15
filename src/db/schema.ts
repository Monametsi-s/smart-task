import { pgTable, text, timestamp, uuid, integer, boolean } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: text("id").primaryKey(), // Using Clerk ID
    name: text("name").notNull(),
    email: text("email").notNull(),
    imageUrl: text("image_url"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const boards = pgTable("boards", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").references(() => users.id).notNull(),
    title: text("title").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const columns = pgTable("columns", {
    id: uuid("id").defaultRandom().primaryKey(),
    boardId: uuid("board_id").references(() => boards.id, { onDelete: 'cascade' }).notNull(),
    title: text("title").notNull(),
    order: integer("order").notNull(),
});

export const tasks = pgTable("tasks", {
    id: uuid("id").defaultRandom().primaryKey(),
    columnId: uuid("column_id").references(() => columns.id, { onDelete: 'cascade' }).notNull(),
    content: text("content").notNull(),
    order: integer("order").notNull(),
    priority: text("priority").default('medium'), // low, medium, high
    aiGenerated: boolean("ai_generated").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});
