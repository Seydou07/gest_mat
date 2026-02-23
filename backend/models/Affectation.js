// models/Affectation.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Affectation = sequelize.define('Affectation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  materiel_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'materiels',
      key: 'id'
    }
  },
  agent_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'agents',
      key: 'id'
    }
  },
  projet_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'projets',
      key: 'id'
    }
  },
  date_affectation: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  date_retour: {
    type: DataTypes.DATEONLY
  },
  statut: {
    type: DataTypes.ENUM('en_cours', 'termine', 'annule'),
    defaultValue: 'en_cours'
  },
  commentaire: {
    type: DataTypes.TEXT
  },
  created_by: {
    type: DataTypes.STRING(50)
  }
}, {
  tableName: 'affectations',
  timestamps: true,
  underscored: true
});

module.exports = Affectation;