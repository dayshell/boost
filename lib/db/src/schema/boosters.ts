import { pgTable, serial, integer, text, timestamp, decimal, pgEnum, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { usersTable } from "./users";

export const boosterStatusEnum = pgEnum("booster_status", ["pending", "approved", "rejected", "suspended"]);

export const boostersTable = pgTable("boosters", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  telegram: text("telegram").notNull(),
  games: jsonb("games").notNull().$type<string[]>(), // ["CS2", "Dota 2", "Valorant"]
  experience: text("experience").notNull(), // "2 years"
  ranks: text("ranks").notNull(), // "Global Elite, Immortal"
  rate: decimal("rate", { precision: 10, scale: 2 }).notNull(), // hourly rate in USD
  about: text("about"),
  otherProfiles: text("other_profiles"), // links to other platforms
  status: boosterStatusEnum("status").notNull().default("pending"),
  totalOrders: integer("total_orders").notNull().default(0),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0.00"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertBoosterSchema = createInsertSchema(boostersTable, {
  telegram: z.string().min(1),
  games: z.array(z.string()).min(1),
  experience: z.string().min(1),
  ranks: z.string().min(1),
  rate: z.string().regex(/^\d+(\.\d{1,2})?$/),
}).omit({ id: true, totalOrders: true, rating: true, createdAt: true, updatedAt: true });

export const selectBoosterSchema = createSelectSchema(boostersTable);

export type InsertBooster = z.infer<typeof insertBoosterSchema>;
export type Booster = typeof boostersTable.$inferSelect;
