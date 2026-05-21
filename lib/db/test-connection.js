import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Загружаем .env из корня проекта
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const { Client } = pg;

async function testConnection() {
  const DATABASE_URL = process.env.DATABASE_URL;

  if (!DATABASE_URL) {
    console.error('❌ DATABASE_URL не найден в .env файле!');
    console.log('\n📝 Создайте файл .env в корне проекта с содержимым:');
    console.log('DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres\n');
    process.exit(1);
  }

  console.log('🔌 Тестирование подключения к базе данных...\n');
  console.log(`📍 Host: ${DATABASE_URL.split('@')[1]?.split('/')[0] || 'unknown'}\n`);

  const client = new Client({
    connectionString: DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('✅ Подключение успешно!\n');

    // Проверяем версию PostgreSQL
    const versionResult = await client.query('SELECT version();');
    console.log('📊 PostgreSQL версия:');
    console.log(`   ${versionResult.rows[0].version.split(',')[0]}\n`);

    // Проверяем существующие таблицы
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    if (tablesResult.rows.length > 0) {
      console.log('📋 Существующие таблицы:');
      tablesResult.rows.forEach(row => {
        console.log(`   ✓ ${row.table_name}`);
      });
      console.log('\n✅ База данных уже настроена!');
      console.log('💡 Можете запускать приложение.');
    } else {
      console.log('⚠️  Таблицы не найдены.');
      console.log('\n📝 Запустите настройку базы данных:');
      console.log('   cd lib/db');
      console.log('   pnpm run setup');
    }

  } catch (error) {
    console.error('❌ Ошибка подключения:');
    console.error(`   ${error.message}\n`);
    
    if (error.message.includes('password authentication failed')) {
      console.log('💡 Проверьте пароль в DATABASE_URL');
    } else if (error.message.includes('getaddrinfo ENOTFOUND')) {
      console.log('💡 Проверьте хост в DATABASE_URL');
    } else if (error.message.includes('connect ECONNREFUSED')) {
      console.log('💡 База данных недоступна. Проверьте:');
      console.log('   1. PostgreSQL запущен');
      console.log('   2. Правильный хост и порт');
      console.log('   3. Firewall не блокирует подключение');
    }
    
    console.log('\n📚 Инструкция по настройке: см. SUPABASE_SETUP.md');
    process.exit(1);
  } finally {
    await client.end();
  }
}

testConnection();
