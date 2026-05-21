import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { usersTable } from "./src/schema/users.ts";
import { eq } from "drizzle-orm";
import * as dotenv from "dotenv";

// Загружаем переменные окружения
dotenv.config({ path: "../../.env" });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL not found");
}

const client = postgres(DATABASE_URL);
const db = drizzle(client);

async function updateAdmin() {
  try {
    console.log("Updating admin@boost.com role to admin...");
    
    const result = await db
      .update(usersTable)
      .set({ role: "admin" })
      .where(eq(usersTable.email, "admin@boost.com"))
      .returning();

    if (result.length > 0) {
      console.log("✅ Successfully updated admin@boost.com:");
      console.log("   ID:", result[0].id);
      console.log("   Email:", result[0].email);
      console.log("   Role:", result[0].role);
    } else {
      console.log("❌ User admin@boost.com not found");
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.end();
  }
}

updateAdmin();
