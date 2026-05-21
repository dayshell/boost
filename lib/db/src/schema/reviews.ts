import { pgTable, serial, integer, text, timestamp, smallint } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { usersTable } from "./users";
import { ordersTable } from "./orders";
import { boostersTable } from "./boosters";

export const reviewsTable = pgTable("reviews", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull().references(() => ordersTable.id, { onDelete: "cascade" }),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  boosterId: integer("booster_id").notNull().references(() => boostersTable.id, { onDelete: "cascade" }),
  rating: smallint("rating").notNull(), // 1-5
  comment: text("comment"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertReviewSchema = createInsertSchema(reviewsTable, {
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
}).omit({ id: true, createdAt: true });

export const selectReviewSchema = createSelectSchema(reviewsTable);

export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviewsTable.$inferSelect;
