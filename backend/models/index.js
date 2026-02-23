// models/index.js
const sequelize = require('../config/database');
const User = require('./User');
const Projet = require('./Projet');
const Fonction = require('./Fonction');
const Agent = require('./Agent');
const TypeMateriel = require('./TypeMateriel');
const Marque = require('./Marque');
const Localisation = require('./Localisation');
const EtatMateriel = require('./EtatMateriel');
const Materiel = require('./Materiel');
const PvReception = require('./PvReception');
const Historique = require('./Historique');
const Affectation = require('./Affectation');

// Associations
Fonction.hasMany(Agent, { foreignKey: 'fonction_id' });
Agent.belongsTo(Fonction, { foreignKey: 'fonction_id' });

TypeMateriel.hasMany(Materiel, { foreignKey: 'type_id' });
Materiel.belongsTo(TypeMateriel, { foreignKey: 'type_id' });

EtatMateriel.hasMany(Materiel, { foreignKey: 'etat_id' });
Materiel.belongsTo(EtatMateriel, { foreignKey: 'etat_id' });

Localisation.hasMany(Materiel, { foreignKey: 'localisation_id' });
Materiel.belongsTo(Localisation, { foreignKey: 'localisation_id' });

Projet.hasMany(Materiel, { foreignKey: 'id_projet' });
Materiel.belongsTo(Projet, { foreignKey: 'id_projet' });

Marque.hasMany(Materiel, { foreignKey: 'marque_id' });
Materiel.belongsTo(Marque, { foreignKey: 'marque_id' });

Projet.hasMany(PvReception, { foreignKey: 'projet_id' });
PvReception.belongsTo(Projet, { foreignKey: 'projet_id' });

Materiel.hasMany(Historique, { foreignKey: 'materiel_id' });
Historique.belongsTo(Materiel, { foreignKey: 'materiel_id' });

// Associations Historique avec alias (utilisés dans historiqueController)
Historique.belongsTo(Agent, { as: 'ancienAgent', foreignKey: 'ancien_agent_id' });
Historique.belongsTo(Agent, { as: 'nouvelAgent', foreignKey: 'nouvel_agent_id' });
Historique.belongsTo(Projet, { as: 'ancienProjet', foreignKey: 'ancien_projet_id' });
Historique.belongsTo(Projet, { as: 'nouvelProjet', foreignKey: 'nouvel_projet_id' });

Materiel.hasMany(Affectation, { foreignKey: 'materiel_id' });
Affectation.belongsTo(Materiel, { foreignKey: 'materiel_id' });

Agent.hasMany(Affectation, { foreignKey: 'agent_id' });
Affectation.belongsTo(Agent, { foreignKey: 'agent_id' });

Projet.hasMany(Affectation, { foreignKey: 'projet_id' });
Affectation.belongsTo(Projet, { foreignKey: 'projet_id' });

module.exports = {
  sequelize,
  User,
  Projet,
  Fonction,
  Agent,
  TypeMateriel,
  Marque,
  Affectation,
  Localisation,
  EtatMateriel,
  Materiel,
  PvReception,
  Historique
};