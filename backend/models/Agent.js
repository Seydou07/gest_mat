// models/Agent.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Agent = sequelize.define('Agent', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  matricule: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  nom: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  prenom: {
    type: DataTypes.STRING(100)
  },
  date_naissance: {
    type: DataTypes.DATEONLY
  },
  telephone: {
    type: DataTypes.STRING(20)
  },
  email: {
    type: DataTypes.STRING(100)
  },
  // Clé étrangère vers la table fonction
  fonction_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  }
}, {
  tableName: 'agents',
  timestamps: true,
  underscored: true
});

module.exports = Agent;