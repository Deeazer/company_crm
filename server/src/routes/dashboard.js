const express = require('express');
const router = express.Router();
const { Project, Document, User } = require('../models');
const auth = require('../middleware/auth');
const { Op } = require('sequelize');

// Получение статистики для дашборда
router.get('/stats', auth, async (req, res) => {
  try {
    const [
      totalProjects,
      activeProjects,
      totalDocuments,
      totalUsers,
      recentProjects,
      recentDocuments
    ] = await Promise.all([
      // Общее количество проектов
      Project.count(),
      
      // Активные проекты (в процессе)
      Project.count({
        where: {
          status: 'in_progress'
        }
      }),
      
      // Общее количество документов
      Document.count(),
      
      // Общее количество пользователей
      User.count(),
      
      // Последние 5 проектов
      Project.findAll({
        limit: 5,
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: User,
            as: 'manager',
            attributes: ['firstName', 'lastName']
          }
        ]
      }),
      
      // Последние 5 документов
      Document.findAll({
        limit: 5,
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: Project,
            as: 'project',
            attributes: ['name']
          }
        ]
      })
    ]);

    res.json({
      totalProjects,
      activeProjects,
      totalDocuments,
      totalUsers,
      recentProjects,
      recentDocuments
    });
  } catch (error) {
    console.error('Ошибка получения статистики:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router; 