// controllers/fonctionController.js
const { Fonction } = require('../models');

// Récupérer toutes les fonctions
exports.getAll = async (req, res) => {
  try {
    const fonctions = await Fonction.findAll({
      order: [['nom', 'ASC']]
    });
    res.json(fonctions);
  } catch (error) {
    console.error('Erreur récupération fonctions:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des fonctions' });
  }
};

// Récupérer une fonction par ID
exports.getById = async (req, res) => {
  try {
    const fonction = await Fonction.findByPk(req.params.id);
    if (!fonction) {
      return res.status(404).json({ message: 'Fonction non trouvée' });
    }
    res.json(fonction);
  } catch (error) {
    console.error('Erreur récupération fonction:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération de la fonction' });
  }
};

// Créer une fonction
exports.create = async (req, res) => {
  try {
    const { nom } = req.body;
    
    if (!nom) {
      return res.status(400).json({ message: 'Le nom est requis' });
    }

    const fonction = await Fonction.create({ nom });

    res.status(201).json({
      message: 'Fonction créée avec succès',
      fonction
    });
  } catch (error) {
    console.error('Erreur création fonction:', error);
    res.status(500).json({ message: 'Erreur lors de la création de la fonction' });
  }
};

// Modifier une fonction
exports.update = async (req, res) => {
  try {
    const fonction = await Fonction.findByPk(req.params.id);
    if (!fonction) {
      return res.status(404).json({ message: 'Fonction non trouvée' });
    }

    const { nom } = req.body;
    if (!nom) {
      return res.status(400).json({ message: 'Le nom est requis' });
    }

    await fonction.update({ nom });

    res.json({
      message: 'Fonction modifiée avec succès',
      fonction
    });
  } catch (error) {
    console.error('Erreur modification fonction:', error);
    res.status(500).json({ message: 'Erreur lors de la modification de la fonction' });
  }
};

// Supprimer une fonction
exports.delete = async (req, res) => {
  try {
    const fonction = await Fonction.findByPk(req.params.id);
    if (!fonction) {
      return res.status(404).json({ message: 'Fonction non trouvée' });
    }

    await fonction.destroy();

    res.json({ message: 'Fonction supprimée avec succès' });
  } catch (error) {
    console.error('Erreur suppression fonction:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression de la fonction' });
  }
};