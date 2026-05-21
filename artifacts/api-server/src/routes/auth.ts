import { Router, type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db, usersTable, bansTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

// Проверка email и определение нужен ли пароль
router.post("/check-email", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Ищем пользователя
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    if (!user) {
      // Пользователь не найден - можно войти без пароля (автоматическая регистрация)
      return res.json({
        exists: false,
        requiresPassword: false,
      });
    }

    // Проверяем, установлен ли пароль
    const hasPassword = user.passwordHash && user.passwordHash !== "";

    return res.json({
      exists: true,
      requiresPassword: hasPassword,
    });
  } catch (error) {
    console.error("Check email error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Вход/Регистрация без пароля
router.post("/signin-email", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Ищем или создаем пользователя
    let [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    if (!user) {
      // Создаем нового пользователя без пароля
      // Если email = admin@boost.com, делаем админом
      const role = email === "admin@boost.com" ? "admin" : "user";
      
      [user] = await db
        .insert(usersTable)
        .values({
          email,
          passwordHash: "", // Пустой пароль
          role: role as "user" | "booster" | "admin",
        })
        .returning();
    } else {
      // Проверяем, что у пользователя нет пароля
      if (user.passwordHash && user.passwordHash !== "") {
        return res.status(400).json({ error: "Password required for this account" });
      }
      
      // Проверяем бан
      if (user.isBanned) {
        return res.status(403).json({ 
          error: "Account banned",
          banned: true,
        });
      }
    }

    // Создаем JWT токен
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        role: user.role,
        balance: user.balance,
        avatar: user.avatar,
        isBanned: user.isBanned,
      },
    });
  } catch (error) {
    console.error("Signin email error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Вход с паролем
router.post("/signin-password", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Ищем пользователя
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Проверяем бан
    if (user.isBanned) {
      return res.status(403).json({ 
        error: "Account banned",
        banned: true,
      });
    }

    // Проверяем пароль
    if (!user.passwordHash || user.passwordHash === "") {
      return res.status(400).json({ error: "No password set for this account" });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Создаем JWT токен
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        role: user.role,
        balance: user.balance,
        avatar: user.avatar,
        isBanned: user.isBanned,
      },
    });
  } catch (error) {
    console.error("Signin password error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Установка пароля (для залогиненных пользователей)
router.post("/set-password", async (req: Request, res: Response) => {
  try {
    const { password } = req.body;
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    // Проверяем токен
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };

    // Хешируем пароль
    const passwordHash = await bcrypt.hash(password, 10);

    // Обновляем пароль
    await db
      .update(usersTable)
      .set({ passwordHash })
      .where(eq(usersTable.id, decoded.userId));

    return res.json({ success: true, message: "Password set successfully" });
  } catch (error) {
    console.error("Set password error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Получение текущего пользователя
router.get("/me", async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, decoded.userId))
      .limit(1);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Если пользователь забанен, получаем информацию о бане
    let banInfo = null;
    if (user.isBanned) {
      const [ban] = await db
        .select()
        .from(bansTable)
        .where(eq(bansTable.userId, user.id))
        .orderBy(desc(bansTable.createdAt))
        .limit(1);
      
      if (ban) {
        banInfo = {
          reason: ban.reason,
          bannedUntil: ban.bannedUntil,
          isPermanent: ban.isPermanent,
        };
      }
    }

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
      },
      ban: banInfo,
    });
  } catch (error) {
    console.error("Get me error:", error);
    return res.status(401).json({ error: "Invalid token" });
  }
});

// Обновление профиля (nickname)
router.patch("/profile", async (req: Request, res: Response) => {
  try {
    const { nickname } = req.body;
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };

    const [user] = await db
      .update(usersTable)
      .set({ nickname })
      .where(eq(usersTable.id, decoded.userId))
      .returning();

    return res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Получение всех пользователей (только для админа)
router.get("/users", async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; role: string };

    // Проверяем, что пользователь - админ
    if (decoded.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admin only." });
    }

    const users = await db.select().from(usersTable);

    return res.json({
      users: users.map(u => ({
        id: u.id,
        email: u.email,
        role: u.role,
        balance: u.balance,
        avatar: u.avatar,
        createdAt: u.createdAt,
        hasPassword: u.passwordHash !== "",
      })),
    });
  } catch (error) {
    console.error("Get users error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Изменение роли пользователя (только для админа)
router.post("/change-role", async (req: Request, res: Response) => {
  try {
    const { userId, newRole } = req.body;
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; role: string };

    // Проверяем, что пользователь - админ
    if (decoded.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admin only." });
    }

    if (!userId || !newRole) {
      return res.status(400).json({ error: "userId and newRole are required" });
    }

    if (!["user", "booster", "admin"].includes(newRole)) {
      return res.status(400).json({ error: "Invalid role. Must be: user, booster, or admin" });
    }

    // Обновляем роль
    await db
      .update(usersTable)
      .set({ role: newRole as "user" | "booster" | "admin" })
      .where(eq(usersTable.id, userId));

    return res.json({ success: true, message: "Role updated successfully" });
  } catch (error) {
    console.error("Change role error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ВРЕМЕННЫЙ endpoint для обновления admin@boost.com (удалить после использования)
router.post("/make-admin", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Обновляем роль на admin
    const [user] = await db
      .update(usersTable)
      .set({ role: "admin" })
      .where(eq(usersTable.email, email))
      .returning();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({
      success: true,
      message: `User ${email} is now admin`,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Make admin error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
