// models/Historique.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Historique = sequelize.define('Historique', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  materiel_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  date_mouvement: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  type_mouvement: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  ancien_agent_id: {
    type: DataTypes.INTEGER
  },
  nouvel_agent_id: {
    type: DataTypes.INTEGER
  },
  ancien_projet_id: {
    type: DataTypes.INTEGER
  },
  nouvel_projet_id: {
    type: DataTypes.INTEGER
  },
  commentaire: {
    type: DataTypes.TEXT
  },
  created_by: {
    type: DataTypes.STRING(50)
  }
}, {
  tableName: 'historique_mouvements',
  timestamps: false,
  underscored: true
});

module.exports = Historique;