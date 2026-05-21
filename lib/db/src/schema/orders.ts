import { pgTable, serial, integer, text, timestamp, decimal, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { usersTable } from "./users";
import { boostersTable } from "./boosters";

export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "assigned",
  "in_progress",
  "completed",
  "cancelled",
  "disputed"
]);

export const ordersTable = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  boosterId: integer("booster_id").references(() => boostersTable.id, { onDelete: "set null" }),
  game: text("game").notNull(), // "CS2", "Dota 2", "Valorant"
  fromRank: text("from_rank").notNull(),
  toRank: text("to_rank").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  status: orderStatusEnum("status").notNull().default("pending"),
  notes: text("notes"),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertOrderSchema = createInsertSchema(ordersTable, {
  game: z.string().min(1),
  fromRank: z.string().min(1),
  toRank: z.string().min(1),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/),
}).omit({ id: true, createdAt: true, updatedAt: true });

export const selectOrderSchema = createSelectSchema(ordersTable);

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof ordersTable.$inferSelect;
