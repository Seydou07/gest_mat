// controllers/pvController.js
const { PvReception, Projet, Agent } = require('../models');
const path = require('path');
const fs = require('fs');

// Récupérer tous les PV
exports.getAll = async (req, res) => {
  try {
    const pvs = await PvReception.findAll({
      include: [
        { model: Projet, attributes: ['id', 'nom'] }
      ],
      order: [['date_reception', 'DESC']]
    });
    res.json(pvs);
  } catch (error) {
    console.error('Erreur récupération PV:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des PV' });
  }
};

// Récupérer un PV par ID
exports.getById = async (req, res) => {
  try {
    const pv = await PvReception.findByPk(req.params.id, {
      include: [
        { model: Projet, attributes: ['id', 'nom'] }
      ]
    });
    if (!pv) {
      return res.status(404).json({ message: 'PV non trouvé' });
    }
    res.json(pv);
  } catch (error) {
    console.error('Erreur récupération PV:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du PV' });
  }
};

// Créer un PV avec upload de fichier
exports.create = async (req, res) => {
  try {
    const { numero_marche, objet, date_reception, lieu, observations, projet_id } = req.body;
    const fichier = req.file ? req.file.filename : null;

    const pv = await PvReception.create({
      numero_marche,
      objet,
      date_reception,
      lieu,
      observations,
      fichier,
      projet_id
    });

    res.status(201).json({
      message: 'PV créé avec succès',
      pv
    });
  } catch (error) {
    console.error('Erreur création PV:', error);
    res.status(500).json({ message: 'Erreur lors de la création du PV' });
  }
};

// Modifier un PV
exports.update = async (req, res) => {
  try {
    const pv = await PvReception.findByPk(req.params.id);
    if (!pv) {
      return res.status(404).json({ message: 'PV non trouvé' });
    }

    await pv.update(req.body);

    res.json({
      message: 'PV modifié avec succès',
      pv
    });
  } catch (error) {
    console.error('Erreur modification PV:', error);
    res.status(500).json({ message: 'Erreur lors de la modification du PV' });
  }
};

// Supprimer un PV (et son fichier)
exports.delete = async (req, res) => {
  try {
    const pv = await PvReception.findByPk(req.params.id);
    if (!pv) {
      return res.status(404).json({ message: 'PV non trouvé' });
    }

    // Supprimer le fichier associé s'il existe
    if (pv.fichier) {
      const filePath = path.join(__dirname, '../uploads/pv', pv.fichier);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await pv.destroy();

    res.json({ message: 'PV supprimé avec succès' });
  } catch (error) {
    console.error('Erreur suppression PV:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression du PV' });
  }
};

// Télécharger le fichier d'un PV
exports.downloadFile = async (req, res) => {
  try {
    const pv = await PvReception.findByPk(req.params.id);
    if (!pv || !pv.fichier) {
      return res.status(404).json({ message: 'Fichier non trouvé' });
    }

    const filePath = path.join(__dirname, '../uploads/pv', pv.fichier);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'Fichier non trouvé sur le serveur' });
    }

    res.download(filePath);
  } catch (error) {
    console.error('Erreur téléchargement fichier:', error);
    res.status(500).json({ message: 'Erreur lors du téléchargement du fichier' });
  }
};