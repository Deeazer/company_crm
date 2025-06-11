module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define('Project', {
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
          msg: 'Название проекта не может быть пустым',
        },
        len: {
          args: [3, 100],
          msg: 'Название проекта должно содержать от 3 до 100 символов',
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 1000],
          msg: 'Описание проекта не должно превышать 1000 символов',
        },
      },
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: {
          msg: 'Неверный формат даты начала',
        },
      },
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: {
          msg: 'Неверный формат даты окончания',
        },
        isAfterStartDate(value) {
          if (value && this.startDate && value < this.startDate) {
            throw new Error('Дата окончания не может быть раньше даты начала');
          }
        },
      },
    },
    progress: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100,
      },
    },
    client: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('planning', 'in_progress', 'completed', 'on_hold', 'cancelled'),
      allowNull: false,
      defaultValue: 'planning',
      validate: {
        isIn: {
          args: [['planning', 'in_progress', 'completed', 'on_hold', 'cancelled']],
          msg: 'Недопустимый статус проекта',
        },
      },
    },
    stages: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
    },
    projectManagerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    budget: {
      type: DataTypes.DECIMAL(10, 2),
      validate: {
        isDecimal: {
          msg: 'Бюджет должен быть числом',
        },
        min: {
          args: [0],
          msg: 'Бюджет не может быть отрицательным',
        },
      },
    },
    managerId: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Необходимо указать руководителя проекта',
        },
      },
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
      defaultValue: 'medium',
      validate: {
        isIn: {
          args: [['low', 'medium', 'high', 'critical']],
          msg: 'Недопустимый приоритет проекта',
        },
      },
    },
  }, {
    timestamps: true,
    hooks: {
      beforeValidate: (project) => {
        if (project.stages && typeof project.stages === 'string') {
          project.stages = JSON.parse(project.stages);
        }
      },
    },
  });

  return Project;
}; 