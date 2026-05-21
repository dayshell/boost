import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Загружаем .env из корня проекта
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const { Client } = pg;

async function setupDatabase() {
  const DATABASE_URL = process.env.DATABASE_URL;

  if (!DATABASE_URL) {
    console.error('❌ DATABASE_URL не установлен!');
    console.log('\n📝 Инструкции:');
    console.log('1. Создайте бесплатный аккаунт на https://supabase.com');
    console.log('2. Создайте новый проект');
    console.log('3. Скопируйте DATABASE_URL из Settings → Database → Connection string');
    console.log('4. Создайте файл .env в корне проекта:');
    console.log('   DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres\n');
    process.exit(1);
  }

  console.log('🔌 Подключение к базе данных...');

  const client = new Client({
    connectionString: DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('✅ Подключение успешно!\n');

    // Читаем SQL миграцию
    const migrationPath = path.join(__dirname, 'migrations', '0001_initial_schema.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('📦 Применение миграций...');
    
    // Разбиваем на отдельные команды
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    for (const statement of statements) {
      try {
        await client.query(statement);
      } catch (error) {
        // Игнорируем ошибки "already exists"
        if (!error.message.includes('already exists')) {
          throw error;
        }
      }
    }

    console.log('✅ Миграции применены успешно!\n');

    // Проверяем созданные таблицы
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    console.log('📊 Созданные таблицы:');
    result.rows.forEach(row => {
      console.log(`   ✓ ${row.table_name}`);
    });

    console.log('\n🎉 База данных готова к использованию!');
    console.log('\n📝 Следующие шаги:');
    console.log('1. Запустите API сервер: cd artifacts/api-server && pnpm run dev');
    console.log('2. Запустите фронтенд: cd artifacts/mobbin-clone && pnpm run dev');

  } catch (error) {
    console.error('❌ Ошибка при настройке базы данных:');
    console.error(error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

setupDatabase();
