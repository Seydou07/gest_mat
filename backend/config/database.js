const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('gestion_materiel', 'root', '', {
  host: '127.0.0.1',   // utilisation explicite de l'IP locale
  port: 3306,          // adapte ce port si ton MySQL écoute ailleurs
  dialect: 'mysql',
  logging: false
});

module.exports = sequelize;