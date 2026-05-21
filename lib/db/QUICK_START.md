# ⚡ Быстрый старт базы данных

## 🎯 За 5 минут

### 1. Создайте Supabase проект
👉 https://supabase.com → Sign in → New Project

- Name: `boost-platform`
- Password: придумайте (сохраните!)
- Region: ближайший
- Plan: **Free**

### 2. Получите DATABASE_URL
Settings → Database → Connection string → **URI**

Скопируйте и замените `[PASSWORD]`:
```
postgresql://postgres.xxxxx:[PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

### 3. Обновите .env
Откройте `.env` в корне проекта, вставьте вашу строку:
```env
DATABASE_URL=postgresql://postgres.xxxxx:ВАШ_ПАРОЛЬ@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

### 4. Примените миграции
```bash
cd lib/db
pnpm run setup
```

### 5. Проверьте
```bash
pnpm run test
```

Должно показать:
```
✅ Подключение успешно!
📋 Существующие таблицы:
   ✓ users
   ✓ boosters
   ✓ orders
   ✓ reviews
   ✓ transactions
```

## 🎉 Готово!

Теперь запустите приложение:
```bash
# Терминал 1: API
cd artifacts/api-server
pnpm run dev

# Терминал 2: Frontend
cd artifacts/mobbin-clone
$env:PORT="5173"; $env:BASE_PATH="/"; pnpm run dev
```

Откройте: http://localhost:5173

---

## 📚 Подробная инструкция
См. `DATABASE_SETUP_GUIDE.md` или `SUPABASE_SETUP.md`
