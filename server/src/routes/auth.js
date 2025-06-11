const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const auth = require('../middleware/auth');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { Op } = require('sequelize');

// Настройка транспорта для отправки email
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Регистрация
router.post('/register', async (req, res) => {
  try {
    console.log('Получен запрос на регистрацию:', req.body);
    const { email, password, firstName, lastName, role } = req.body;

    // Проверяем, существует ли пользователь
    const existingUser = await User.findOne({ where: { email } });
    console.log('Проверка существующего пользователя:', existingUser ? 'найден' : 'не найден');
    
    if (existingUser) {
      console.log('Пользователь уже существует:', email);
      return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
    }

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Пароль захеширован');

    // Создаем пользователя
    console.log('Создание пользователя:', { email, firstName, lastName, role });
    const user = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: role || 'user'
    });
    console.log('Пользователь успешно создан:', {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    });

    res.status(201).json({ message: 'Пользователь успешно зарегистрирован' });
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    console.error('Детали ошибки:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      errors: error.errors
    });
    res.status(500).json({ 
      message: 'Ошибка при регистрации пользователя',
      details: error.message,
      errors: error.errors
    });
  }
});

// Вход
router.post('/login', async (req, res) => {
  try {
    console.log('Получен запрос на вход:', req.body);
    const { email, password } = req.body;

    // Находим пользователя
    const user = await User.findOne({ where: { email } });
    console.log('Найден пользователь:', user ? 'да' : 'нет');
    
    if (!user) {
      console.log('Пользователь не найден:', email);
      return res.status(401).json({ message: 'Неверный email или пароль' });
    }

    // Проверяем пароль
    console.log('Проверка пароля...');
    console.log('Введенный пароль:', password);
    console.log('Хеш пароля в базе:', user.password);
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log('Пароль верный:', isValidPassword);
    
    if (!isValidPassword) {
      console.log('Неверный пароль для пользователя:', email);
      return res.status(401).json({ message: 'Неверный email или пароль' });
    }

    // Создаем токен
    console.log('Создание токена для пользователя:', user.id);
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('Успешный вход пользователя:', user.id);
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Ошибка входа:', error);
    console.error('Детали ошибки:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ message: 'Ошибка при входе в систему' });
  }
});

// Запрос на восстановление пароля
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    // Находим пользователя
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // Генерируем токен для сброса пароля
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 час

    // Сохраняем токен в базе
    await user.update({
      resetToken,
      resetTokenExpiry
    });

    // Отправляем email с инструкциями
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    await transporter.sendMail({
      to: user.email,
      subject: 'Восстановление пароля',
      html: `
        <h1>Восстановление пароля</h1>
        <p>Для восстановления пароля перейдите по ссылке:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>Ссылка действительна в течение 1 часа.</p>
      `
    });

    res.json({ message: 'Инструкции по восстановлению пароля отправлены на ваш email' });
  } catch (error) {
    console.error('Ошибка восстановления пароля:', error);
    res.status(500).json({ message: 'Ошибка при отправке инструкций по восстановлению пароля' });
  }
});

// Сброс пароля
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;

    // Находим пользователя по токену
    const user = await User.findOne({
      where: {
        resetToken: token,
        resetTokenExpiry: { [Op.gt]: Date.now() }
      }
    });

    if (!user) {
      return res.status(400).json({ message: 'Недействительный или истекший токен' });
    }

    // Хешируем новый пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // Обновляем пароль и очищаем токены
    await user.update({
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null
    });

    res.json({ message: 'Пароль успешно изменен' });
  } catch (error) {
    console.error('Ошибка сброса пароля:', error);
    res.status(500).json({ message: 'Ошибка при сбросе пароля' });
  }
});

// Получение информации о текущем пользователе
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'email', 'firstName', 'lastName', 'role']
    });
    res.json(user);
  } catch (error) {
    console.error('Ошибка получения данных пользователя:', error);
    res.status(500).json({ message: 'Ошибка при получении данных пользователя' });
  }
});

module.exports = router; 