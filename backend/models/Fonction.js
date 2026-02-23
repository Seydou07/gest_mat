// models/Fonction.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Fonction = sequelize.define('Fonction', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nom: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'fonction',
  timestamps: true,
  underscored: true
});

module.exports = Fonction;