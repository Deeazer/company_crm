const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Document, Project } = require('../models');
const auth = require('../middleware/auth');

// Настройка multer для загрузки файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // Лимит 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Недопустимый тип файла'));
    }
  },
});

// Получение всех документов
router.get('/', auth, async (req, res) => {
  try {
    const documents = await Document.findAll({
      include: [
        {
          model: Project,
          as: 'project',
          attributes: ['id', 'name'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json(documents);
  } catch (error) {
    console.error('Ошибка получения документов:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Получение документа по ID
router.get('/:id', auth, async (req, res) => {
  try {
    const document = await Document.findByPk(req.params.id, {
      include: [
        {
          model: Project,
          as: 'project',
          attributes: ['id', 'name'],
        },
      ],
    });

    if (!document) {
      return res.status(404).json({ message: 'Документ не найден' });
    }

    res.json(document);
  } catch (error) {
    console.error('Ошибка получения документа:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Загрузка документа
router.post('/', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Файл не загружен' });
    }

    const { name, description, projectId, category } = req.body;

    const document = await Document.create({
      name: name || req.file.originalname,
      description,
      filePath: req.file.path,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      uploadedBy: req.user.id,
      projectId,
      category,
    });

    res.status(201).json(document);
  } catch (error) {
    console.error('Ошибка загрузки документа:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Удаление документа
router.delete('/:id', auth, async (req, res) => {
  try {
    const document = await Document.findByPk(req.params.id);

    if (!document) {
      return res.status(404).json({ message: 'Документ не найден' });
    }

    // Удаление файла из файловой системы
    if (fs.existsSync(document.filePath)) {
      fs.unlinkSync(document.filePath);
    }

    await document.destroy();
    res.json({ message: 'Документ успешно удален' });
  } catch (error) {
    console.error('Ошибка удаления документа:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router; 