// models/PvReception.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PvReception = sequelize.define('PvReception', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  numero_marche: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  objet: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  date_reception: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  lieu: {
    type: DataTypes.STRING(200)
  },
  observations: {
    type: DataTypes.TEXT
  },
  fichier: {
    type: DataTypes.STRING(255)
  }
}, {
  tableName: 'pv_reception',
  timestamps: true,
  underscored: true
});

module.exports = PvReception;