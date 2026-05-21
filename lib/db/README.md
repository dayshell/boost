# PostgreSQL Database Setup

## 📋 Структура базы данных

### Таблицы:

1. **users** - Пользователи платформы
   - id, email, password_hash, role, balance, avatar
   - Роли: user, booster, admin

2. **boosters** - Профили бустеров
   - id, user_id, telegram, games, experience, ranks, rate, about, other_profiles
   - Статусы: pending, approved, rejected, suspended

3. **orders** - Заказы на буст
   - id, user_id, booster_id, game, from_rank, to_rank, price, status
   - Статусы: pending, assigned, in_progress, completed, cancelled, disputed

4. **reviews** - Отзывы о бустерах
   - id, order_id, user_id, booster_id, rating (1-5), comment

5. **transactions** - Финансовые транзакции
   - id, user_id, amount, type, status, description
   - Типы: deposit, withdrawal, order_payment, order_refund, booster_payout

---

## 🚀 Быстрый старт

### 1. Установка PostgreSQL локально (опционально)

**Windows:**
```bash
# Скачайте с https://www.postgresql.org/download/windows/
# Или через Chocolatey:
choco install postgresql
```

**Или используйте Docker:**
```bash
docker run --name boost-postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:16
```

### 2. Создайте базу данных

```bash
# Подключитесь к PostgreSQL
psql -U postgres

# Создайте БД
CREATE DATABASE boost_platform;

# Выйдите
\q
```

### 3. Настройте переменные окружения

Создайте файл `.env` в корне проекта:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/boost_platform
```

### 4. Примените миграции

**Вариант 1: Через Drizzle Kit (рекомендуется)**
```bash
cd lib/db
pnpm run push
```

**Вариант 2: Вручную через SQL**
```bash
psql -U postgres -d boost_platform -f migrations/0001_initial_schema.sql
```

---

## 🌐 Использование Supabase (рекомендуется для продакшена)

### 1. Создайте проект на Supabase

1. Зайдите на https://supabase.com
2. Создайте новый проект
3. Скопируйте `DATABASE_URL` из Settings → Database

### 2. Обновите .env

```env
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
```

### 3. Примените миграции

```bash
cd lib/db
pnpm run push
```

---

## 📝 Примеры использования

### Создание пользователя

```typescript
import { db, usersTable, insertUserSchema } from "@workspace/db";

const newUser = await db.insert(usersTable).values({
  email: "user@example.com",
  passwordHash: "hashed_password",
  role: "user",
}).returning();
```

### Создание заявки на бустера

```typescript
import { db, boostersTable } from "@workspace/db";

const newBooster = await db.insert(boostersTable).values({
  userId: 1,
  telegram: "@username",
  games: ["CS2", "Valorant"],
  experience: "2 years",
  ranks: "Global Elite, Radiant",
  rate: "25.00",
  about: "Professional booster",
  otherProfiles: "https://example.com/profile",
  status: "pending",
}).returning();
```

### Создание заказа

```typescript
import { db, ordersTable } from "@workspace/db";

const newOrder = await db.insert(ordersTable).values({
  userId: 1,
  game: "CS2",
  fromRank: "Silver",
  toRank: "Global Elite",
  price: "50.00",
  status: "pending",
}).returning();
```

### Получение всех бустеров

```typescript
import { db, boostersTable, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const boosters = await db
  .select()
  .from(boostersTable)
  .leftJoin(usersTable, eq(boostersTable.userId, usersTable.id))
  .where(eq(boostersTable.status, "approved"));
```

---

## 🔧 Полезные команды

```bash
# Применить изменения схемы
pnpm run push

# Применить изменения с force (осторожно!)
pnpm run push-force

# Сгенерировать миграции
drizzle-kit generate

# Открыть Drizzle Studio (GUI для БД)
drizzle-kit studio
```

---

## 📊 ER Диаграмма

```
users (1) ──< (N) boosters
users (1) ──< (N) orders
users (1) ──< (N) transactions
users (1) ──< (N) reviews

boosters (1) ──< (N) orders
boosters (1) ──< (N) reviews

orders (1) ──< (1) reviews
```

---

## 🔐 Безопасность

1. **Никогда не коммитьте .env файлы**
2. Используйте bcrypt для хеширования паролей
3. Настройте Row Level Security в Supabase
4. Используйте prepared statements (Drizzle делает это автоматически)

---

## 📚 Дополнительные ресурсы

- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Supabase Docs](https://supabase.com/docs)
