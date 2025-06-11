module.exports = (sequelize, DataTypes) => {
  const Document = sequelize.define('Document', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Название документа не может быть пустым',
        },
        len: {
          args: [3, 100],
          msg: 'Название документа должно содержать от 3 до 100 символов',
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      validate: {
        len: {
          args: [0, 500],
          msg: 'Описание документа не должно превышать 500 символов',
        },
      },
    },
    filePath: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Путь к файлу не может быть пустым',
        },
      },
    },
    fileType: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Тип файла не может быть пустым',
        },
      },
    },
    fileSize: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: [0],
          msg: 'Размер файла не может быть отрицательным',
        },
        max: {
          args: [10 * 1024 * 1024], // 10MB
          msg: 'Размер файла не может превышать 10MB',
        },
      },
    },
    category: {
      type: DataTypes.ENUM('contract', 'report', 'specification', 'other'),
      defaultValue: 'other',
      validate: {
        isIn: {
          args: [['contract', 'report', 'specification', 'other']],
          msg: 'Недопустимая категория документа',
        },
      },
    },
    version: {
      type: DataTypes.STRING,
      defaultValue: '1.0',
      validate: {
        is: {
          args: /^\d+\.\d+$/,
          msg: 'Неверный формат версии (должен быть в формате X.Y)',
        },
      },
    },
    uploadedBy: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Необходимо указать пользователя, загрузившего документ',
        },
      },
    },
    projectId: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Необходимо указать проект',
        },
      },
    },
  });

  return Document;
}; 