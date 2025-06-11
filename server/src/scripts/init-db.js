require('dotenv').config();
const { sequelize } = require('../models');
const { User } = require('../models');
const bcrypt = require('bcryptjs');

async function initDatabase() {
  try {
    // Синхронизируем модели с базой данных
    await sequelize.sync({ force: true });
    console.log('База данных синхронизирована');

    // Создаем администратора
    const adminPassword = 'Admin123!';
    const adminHashedPassword = await bcrypt.hash(adminPassword, 10);
    console.log('Хешированный пароль администратора:', adminHashedPassword);
    
    const admin = await User.create({
      email: 'admin@cyberbits.com',
      password: adminHashedPassword,
      firstName: 'Admin',
      lastName: 'System',
      role: 'admin'
    });
    console.log('Администратор создан:', {
      id: admin.id,
      email: admin.email,
      password: admin.password
    });

    // Создаем тестового менеджера
    const managerPassword = 'Manager123!';
    const managerHashedPassword = await bcrypt.hash(managerPassword, 10);
    console.log('Хешированный пароль менеджера:', managerHashedPassword);
    
    const manager = await User.create({
      email: 'manager@cyberbits.com',
      password: managerHashedPassword,
      firstName: 'Manager',
      lastName: 'Test',
      role: 'manager'
    });
    console.log('Тестовый менеджер создан:', {
      id: manager.id,
      email: manager.email,
      password: manager.password
    });

    // Создаем тестового пользователя
    const userPassword = 'User123!';
    const userHashedPassword = await bcrypt.hash(userPassword, 10);
    console.log('Хешированный пароль пользователя:', userHashedPassword);
    
    const user = await User.create({
      email: 'user@cyberbits.com',
      password: userHashedPassword,
      firstName: 'User',
      lastName: 'Test',
      role: 'user'
    });
    console.log('Тестовый пользователь создан:', {
      id: user.id,
      email: user.email,
      password: user.password
    });

    console.log('Инициализация базы данных завершена');
  } catch (error) {
    console.error('Ошибка при инициализации базы данных:', error);
    process.exit(1);
  }
}

initDatabase(); 