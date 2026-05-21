import { Router, type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import { db, usersTable, loginLogsTable, activityLogsTable, bansTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

// Middleware для проверки админа
async function requireAdmin(req: Request, res: Response, next: any) {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; role: string };
    if (decoded.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admin only." });
    }

    (req as any).adminId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

// Получить детали пользователя
router.get("/users/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Получаем логи входа
    const loginLogs = await db
      .select()
      .from(loginLogsTable)
      .where(eq(loginLogsTable.userId, userId))
      .orderBy(desc(loginLogsTable.createdAt))
      .limit(50);

    // Получаем логи активности
    const activityLogs = await db
      .select()
      .from(activityLogsTable)
      .where(eq(activityLogsTable.userId, userId))
      .orderBy(desc(activityLogsTable.createdAt))
      .limit(100);

    // Получаем информацию о бане
    const [ban] = await db
      .select()
      .from(bansTable)
      .where(eq(bansTable.userId, userId))
      .orderBy(desc(bansTable.createdAt))
      .limit(1);

    return res.json({
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        role: user.role,
        balance: user.balance,
        avatar: user.avatar,
        isBanned: user.isBanned,
        hasPassword: user.passwordHash !== "",
        createdAt: user.createdAt,
      },
      loginLogs,
      activityLogs,
      ban: ban || null,
    });
  } catch (error) {
    console.error("Get user details error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Обновить данные пользователя
router.patch("/users/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    const { email, nickname, balance } = req.body;

    const updates: any = {};
    if (email !== undefined) updates.email = email;
    if (nickname !== undefined) updates.nickname = nickname;
    if (balance !== undefined) updates.balance = String(balance);

    const [user] = await db
      .update(usersTable)
      .set(updates)
      .where(eq(usersTable.id, userId))
      .returning();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        balance: user.balance,
      },
    });
  } catch (error) {
    console.error("Update user error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Забанить пользователя
router.post("/users/:id/ban", requireAdmin, async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    const { reason, duration, isPermanent } = req.body;
    const adminId = (req as any).adminId;

    if (!reason) {
      return res.status(400).json({ error: "Reason is required" });
    }

    // Обновляем статус бана в users
    await db
      .update(usersTable)
      .set({ isBanned: true })
      .where(eq(usersTable.id, userId));

    // Создаем запись о бане
    const bannedUntil = isPermanent ? null : duration ? new Date(Date.now() + duration * 1000) : null;

    await db.insert(bansTable).values({
      userId,
      reason,
      bannedBy: adminId,
      bannedUntil,
      isPermanent: isPermanent || false,
    });

    return res.json({ success: true, message: "User banned successfully" });
  } catch (error) {
    console.error("Ban user error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Разбанить пользователя
router.post("/users/:id/unban", requireAdmin, async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);

    await db
      .update(usersTable)
      .set({ isBanned: false })
      .where(eq(usersTable.id, userId));

    return res.json({ success: true, message: "User unbanned successfully" });
  } catch (error) {
    console.error("Unban user error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
