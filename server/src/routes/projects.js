const express = require('express');
const router = express.Router();
const { Project, User, Document } = require('../models');
const auth = require('../middleware/auth');
const { Op } = require('sequelize');

// Получение всех проектов
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.findAll({
      include: [
        {
          model: User,
          as: 'manager',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
        {
          model: Document,
          as: 'documents',
        },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json(projects);
  } catch (error) {
    console.error('Ошибка получения проектов:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Получение проекта по ID
router.get('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'manager',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
        {
          model: Document,
          as: 'documents',
        },
      ],
    });

    if (!project) {
      return res.status(404).json({ message: 'Проект не найден' });
    }

    res.json(project);
  } catch (error) {
    console.error('Ошибка получения проекта:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Создание проекта
router.post('/', auth, async (req, res) => {
  try {
    const {
      name,
      description,
      startDate,
      endDate,
      client,
      stages,
      projectManagerId,
      managerId,
      priority,
      budget,
      status,
      progress
    } = req.body;

    const project = await Project.create({
      name,
      description,
      startDate,
      endDate,
      client,
      stages,
      projectManagerId,
      managerId,
      priority,
      budget,
      status: status || 'planning',
      progress: progress || 0,
    });

    res.status(201).json(project);
  } catch (error) {
    console.error('Ошибка создания проекта:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Обновление проекта
router.put('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Проект не найден' });
    }

    const {
      name,
      description,
      startDate,
      endDate,
      progress,
      client,
      stages,
      status,
      projectManagerId,
      managerId,
      priority,
      budget
    } = req.body;

    await project.update({
      name,
      description,
      startDate,
      endDate,
      progress,
      client,
      stages,
      status,
      projectManagerId,
      managerId,
      priority,
      budget
    });

    res.json(project);
  } catch (error) {
    console.error('Ошибка обновления проекта:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Удаление проекта
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Проект не найден' });
    }

    await project.destroy();
    res.json({ message: 'Проект успешно удален' });
  } catch (error) {
    console.error('Ошибка удаления проекта:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router; 