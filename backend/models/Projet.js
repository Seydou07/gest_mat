// models/Projet.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Projet = sequelize.define('Projet', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nom: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  date_debut: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  date_fin: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  statut: {
    type: DataTypes.ENUM('en_cours', 'termine', 'suspendu', 'annule'),
    defaultValue: 'en_cours'
  },
  budget: {
    type: DataTypes.DECIMAL(10, 2)
  }
}, {
  tableName: 'projets',
  timestamps: true,
  underscored: true
});

module.exports = Projet;