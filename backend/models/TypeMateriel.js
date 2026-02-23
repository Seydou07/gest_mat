// models/TypeMateriel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TypeMateriel = sequelize.define('TypeMateriel', {
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
  tableName: 'types_materiel',
  timestamps: true,
  underscored: true
});

module.exports = TypeMateriel;