# 🗄️ Полное руководство по настройке базы данных

## ✅ Что уже сделано:

1. ✅ Создана схема базы данных (5 таблиц)
2. ✅ Настроен Drizzle ORM
3. ✅ Созданы миграции SQL
4. ✅ Подготовлены скрипты установки

---

## 🚀 Быстрый старт (Рекомендуется - Supabase)

### Вариант 1: Supabase (Бесплатно, облачно)

**Преимущества:**
- ✅ Бесплатно до 500MB
- ✅ Не нужно устанавливать PostgreSQL
- ✅ Автоматические бэкапы
- ✅ Готово за 5 минут

**Инструкция:**

1. **Создайте проект на Supabase:**
   - Откройте https://supabase.com
   - Нажмите "Start your project" → Sign in через GitHub
   - Создайте новый проект:
     - Name: `boost-platform`
     - Password: придумайте надежный (сохраните!)
     - Region: выберите ближайший
     - Plan: **Free**
   - Подождите 2-3 минуты

2. **Получите DATABASE_URL:**
   - Settings → Database → Connection string → URI
   - Скопируйте строку (она выглядит так):
     ```
     postgresql://postgres.xxxxx:[PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
     ```
   - Замените `[PASSWORD]` на ваш пароль

3. **Обновите .env файл:**
   ```bash
   # Откройте .env в корне проекта
   # Замените DATABASE_URL на вашу строку из Supabase
   DATABASE_URL=postgresql://postgres.xxxxx:ВАШ_ПАРОЛЬ@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
   ```

4. **Примените миграции:**
   ```bash
   cd lib/db
   pnpm run setup
   ```

5. **Проверьте:**
   ```bash
   pnpm run test
   ```

   Должно показать:
   ```
   ✅ Подключение успешно!
   📊 PostgreSQL версия: ...
   📋 Существующие таблицы:
      ✓ users
      ✓ boosters
      ✓ orders
      ✓ reviews
      ✓ transactions
   ```

---

### Вариант 2: Локальный PostgreSQL (Для разработки)

**Если хотите установить PostgreSQL локально:**

#### Windows:

1. **Скачайте PostgreSQL:**
   - https://www.postgresql.org/download/windows/
   - Или через Chocolatey: `choco install postgresql`

2. **Установите:**
   - Запустите установщик
   - Пароль: `postgres` (или свой)
   - Порт: `5432`
   - Locale: `Russian, Russia`

3. **Создайте базу данных:**
   ```bash
   # Откройте SQL Shell (psql)
   # Введите пароль postgres
   
   CREATE DATABASE boost_platform;
   \q
   ```

4. **Обновите .env:**
   ```env
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/boost_platform
   ```

5. **Примените миграции:**
   ```bash
   cd lib/db
   pnpm run setup
   ```

---

### Вариант 3: Docker (Самый простой для локальной разработки)

1. **Установите Docker Desktop:**
   - https://www.docker.com/products/docker-desktop/

2. **Запустите PostgreSQL:**
   ```bash
   docker run --name boost-postgres \
     -e POSTGRES_PASSWORD=postgres \
     -e POSTGRES_DB=boost_platform \
     -p 5432:5432 \
     -d postgres:16
   ```

3. **Обновите .env:**
   ```env
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/boost_platform
   ```

4. **Примените миграции:**
   ```bash
   cd lib/db
   pnpm run setup
   ```

---

## 📊 Структура базы данных

### Таблицы:

| Таблица | Описание | Ключевые поля |
|---------|----------|---------------|
| **users** | Все пользователи платформы | email, role, balance |
| **boosters** | Профили бустеров | games, experience, ranks, rate |
| **orders** | Заказы на буст | game, from_rank, to_rank, price, status |
| **reviews** | Отзывы о бустерах | rating (1-5), comment |
| **transactions** | Финансовые операции | amount, type, status |

### Роли пользователей:
- `user` - обычный клиент
- `booster` - бустер (может выполнять заказы)
- `admin` - администратор

### Статусы заказов:
- `pending` - ожидает назначения
- `assigned` - назначен бустер
- `in_progress` - в процессе выполнения
- `completed` - завершен
- `cancelled` - отменен
- `disputed` - спор

---

## 🔧 Полезные команды

```bash
# Тестирование подключения
cd lib/db
pnpm run test

# Применение миграций
pnpm run setup

# Открыть Drizzle Studio (GUI для БД)
pnpm run studio

# Применить изменения схемы
pnpm run push

# Пересоздать таблицы (удалит данные!)
pnpm run push-force
```

---

## 🎯 Следующие шаги

После настройки базы данных:

1. **Запустите API сервер:**
   ```bash
   cd artifacts/api-server
   pnpm run dev
   ```

2. **Запустите фронтенд:**
   ```bash
   cd artifacts/mobbin-clone
   $env:PORT="5173"; $env:BASE_PATH="/"; pnpm run dev
   ```

3. **Откройте в браузере:**
   - Frontend: http://localhost:5173
   - API: http://localhost:3000

---

## ❓ Частые проблемы

### "DATABASE_URL не найден"
- Проверьте, что файл `.env` существует в корне проекта
- Убедитесь, что в нем есть строка `DATABASE_URL=...`

### "password authentication failed"
- Проверьте пароль в DATABASE_URL
- Убедитесь, что нет лишних пробелов

### "connect ECONNREFUSED"
- PostgreSQL не запущен
- Проверьте хост и порт в DATABASE_URL
- Для Supabase: проверьте интернет-соединение

### "already exists"
- Это нормально, таблицы уже созданы
- Скрипт автоматически пропускает существующие объекты

---

## 📚 Дополнительные ресурсы

- [Supabase Documentation](https://supabase.com/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

## 💡 Рекомендация

**Для начала используйте Supabase** - это самый быстрый способ начать разработку без установки PostgreSQL локально. Позже можете перейти на локальную БД или свой сервер.
