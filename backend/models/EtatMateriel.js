// models/EtatMateriel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EtatMateriel = sequelize.define('EtatMateriel', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  libelle: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'etat_materiel',
  timestamps: true,
  underscored: true
});

module.exports = EtatMateriel;