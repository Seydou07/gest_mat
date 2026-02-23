// models/Marque.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Marque = sequelize.define('Marque', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nom: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'marques',
  timestamps: true,
  underscored: true
});

module.exports = Marque;