const { Sequelize } = require('sequelize');
const config = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Импорт моделей
db.User = require('./User')(sequelize, Sequelize);
db.Project = require('./Project')(sequelize, Sequelize);
db.Document = require('./Document')(sequelize, Sequelize);

// Определение связей между моделями
db.User.hasMany(db.Project, { foreignKey: 'managerId', as: 'managedProjects' });
db.Project.belongsTo(db.User, { foreignKey: 'managerId', as: 'manager' });

db.Project.hasMany(db.Document, { foreignKey: 'projectId', as: 'documents' });
db.Document.belongsTo(db.Project, { foreignKey: 'projectId', as: 'project' });

db.User.hasMany(db.Document, { foreignKey: 'uploadedBy', as: 'uploadedDocuments' });
db.Document.belongsTo(db.User, { foreignKey: 'uploadedBy', as: 'uploader' });

module.exports = db; 