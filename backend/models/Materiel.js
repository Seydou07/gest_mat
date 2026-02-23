// models/Materiel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Materiel = sequelize.define('Materiel', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  libelle: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  numero_serie: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  date_acquisition: {
    type: DataTypes.DATEONLY
  },
  valeur: {
    type: DataTypes.DECIMAL(10, 2)
  },
  type_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'types_materiel',
      key: 'id'
    }
  },
  etat_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'etat_materiel',
      key: 'id'
    }
  },
  localisation_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'localisations',
      key: 'id'
    }
  },
  id_projet: {
    type: DataTypes.INTEGER,
    references: {
      model: 'projets',
      key: 'id'
    }
  },
  marque_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'marques',
      key: 'id'
    }
  }
}, {
  tableName: 'materiels',
  timestamps: true,
  underscored: true
});

module.exports = Materiel;