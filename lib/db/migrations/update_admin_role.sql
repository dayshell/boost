-- Обновление роли для admin@boost.com
UPDATE users 
SET role = 'admin' 
WHERE email = 'admin@boost.com';

-- Проверка
SELECT id, email, role FROM users WHERE email = 'admin@boost.com';
