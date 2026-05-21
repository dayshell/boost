import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const loginLogsTable = pgTable("login_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  ipAddress: text("ip_address").notNull(),
  country: text("country"),
  city: text("city"),
  device: text("device"),
  browser: text("browser"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type LoginLog = typeof loginLogsTable.$inferSelect;
export type InsertLoginLog = typeof loginLogsTable.$inferInsert;
