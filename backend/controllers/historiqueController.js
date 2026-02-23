// controllers/historiqueController.js
const { Historique, Materiel, Agent, Projet } = require('../models');
const { Op } = require('sequelize');

// Récupérer tout l'historique
exports.getAll = async (req, res) => {
  try {
    const { page = 1, limit = 20, type, dateDebut, dateFin } = req.query;
    const offset = (page - 1) * limit;

    // Construire les filtres
    const where = {};
    
    if (type && type !== 'tous') {
      where.type_mouvement = type;
    }
    
    if (dateDebut || dateFin) {
      where.date_mouvement = {};
      if (dateDebut) {
        where.date_mouvement[Op.gte] = new Date(dateDebut);
      }
      if (dateFin) {
        const fin = new Date(dateFin);
        fin.setHours(23, 59, 59, 999);
        where.date_mouvement[Op.lte] = fin;
      }
    }

    const historiques = await Historique.findAndCountAll({
      where,
      include: [
        { model: Materiel, attributes: ['id', 'libelle', 'numero_serie'] },
        { model: Agent, as: 'ancienAgent', attributes: ['id', 'nom', 'prenom'] },
        { model: Agent, as: 'nouvelAgent', attributes: ['id', 'nom', 'prenom'] },
        { model: Projet, as: 'ancienProjet', attributes: ['id', 'nom'] },
        { model: Projet, as: 'nouvelProjet', attributes: ['id', 'nom'] }
      ],
      order: [['date_mouvement', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      total: historiques.count,
      page: parseInt(page),
      limit: parseInt(limit),
      data: historiques.rows
    });
  } catch (error) {
    console.error('Erreur récupération historique:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'historique' });
  }
};

// Récupérer l'historique d'un matériel spécifique
exports.getByMateriel = async (req, res) => {
  try {
    const historiques = await Historique.findAll({
      where: { materiel_id: req.params.id },
      include: [
        { model: Materiel, attributes: ['id', 'libelle', 'numero_serie'] },
        { model: Agent, as: 'ancienAgent', attributes: ['id', 'nom', 'prenom'] },
        { model: Agent, as: 'nouvelAgent', attributes: ['id', 'nom', 'prenom'] },
        { model: Projet, as: 'ancienProjet', attributes: ['id', 'nom'] },
        { model: Projet, as: 'nouvelProjet', attributes: ['id', 'nom'] }
      ],
      order: [['date_mouvement', 'DESC']]
    });
    res.json(historiques);
  } catch (error) {
    console.error('Erreur récupération historique matériel:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'historique' });
  }
};

// Récupérer l'historique par type de mouvement
exports.getByType = async (req, res) => {
  try {
    const { type } = req.params;
    const historiques = await Historique.findAll({
      where: { type_mouvement: type },
      include: [
        { model: Materiel, attributes: ['id', 'libelle', 'numero_serie'] },
        { model: Agent, as: 'ancienAgent', attributes: ['id', 'nom', 'prenom'] },
        { model: Agent, as: 'nouvelAgent', attributes: ['id', 'nom', 'prenom'] },
        { model: Projet, as: 'ancienProjet', attributes: ['id', 'nom'] },
        { model: Projet, as: 'nouvelProjet', attributes: ['id', 'nom'] }
      ],
      order: [['date_mouvement', 'DESC']]
    });
    res.json(historiques);
  } catch (error) {
    console.error('Erreur récupération historique par type:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'historique' });
  }
};

// Exporter l'historique (format CSV simple)
exports.export = async (req, res) => {
  try {
    const { format = 'csv' } = req.query;
    
    const historiques = await Historique.findAll({
      include: [
        { model: Materiel, attributes: ['libelle', 'numero_serie'] },
        { model: Agent, as: 'ancienAgent', attributes: ['nom', 'prenom'] },
        { model: Agent, as: 'nouvelAgent', attributes: ['nom', 'prenom'] },
        { model: Projet, as: 'ancienProjet', attributes: ['nom'] },
        { model: Projet, as: 'nouvelProjet', attributes: ['nom'] }
      ],
      order: [['date_mouvement', 'DESC']]
    });

    if (format === 'csv') {
      // Générer CSV
      const csvRows = [];
      // En-têtes
      csvRows.push('Date,Type,Matériel,Ancien Agent,Nouvel Agent,Ancien Projet,Nouveau Projet,Commentaire');
      
      // Données
      historiques.forEach(h => {
        csvRows.push([
          h.date_mouvement,
          h.type_mouvement,
          h.Materiel?.libelle || '',
          h.ancienAgent ? `${h.ancienAgent.nom} ${h.ancienAgent.prenom}` : '',
          h.nouvelAgent ? `${h.nouvelAgent.nom} ${h.nouvelAgent.prenom}` : '',
          h.ancienProjet?.nom || '',
          h.nouvelProjet?.nom || '',
          h.commentaire || ''
        ].join(','));
      });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=historique.csv');
      res.send(csvRows.join('\n'));
    } else {
      res.status(400).json({ message: 'Format non supporté' });
    }
  } catch (error) {
    console.error('Erreur export historique:', error);
    res.status(500).json({ message: 'Erreur lors de l\'export de l\'historique' });
  }
};