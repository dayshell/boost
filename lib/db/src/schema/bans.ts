import { pgTable, serial, integer, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const bansTable = pgTable("bans", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  reason: text("reason").notNull(),
  bannedBy: integer("banned_by").references(() => usersTable.id),
  bannedUntil: timestamp("banned_until"),
  isPermanent: boolean("is_permanent").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Ban = typeof bansTable.$inferSelect;
export type InsertBan = typeof bansTable.$inferInsert;
