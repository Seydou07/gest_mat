// models/Localisation.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Localisation = sequelize.define('Localisation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nom: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  adresse: {
    type: DataTypes.STRING(200)
  },
  ville: {
    type: DataTypes.STRING(100)
  },
  pays: {
    type: DataTypes.STRING(100)
  },
  description: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'localisations',
  timestamps: true,
  underscored: true
});

module.exports = Localisation;