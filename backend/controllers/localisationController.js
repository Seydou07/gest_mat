// controllers/localisationController.js
const { Localisation } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const localisations = await Localisation.findAll({ order: [['nom', 'ASC']] });
    res.json(localisations);
  } catch (error) {
    console.error('Erreur récupération localisations:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des localisations' });
  }
};

exports.getById = async (req, res) => {
  try {
    const localisation = await Localisation.findByPk(req.params.id);
    if (!localisation) return res.status(404).json({ message: 'Localisation non trouvée' });
    res.json(localisation);
  } catch (error) {
    console.error('Erreur récupération localisation:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération de la localisation' });
  }
};

exports.create = async (req, res) => {
  try {
    const { nom, adresse, ville, pays, description } = req.body;
    if (!nom) return res.status(400).json({ message: 'Le nom est requis' });

    const localisation = await Localisation.create({ nom, adresse, ville, pays, description });
    res.status(201).json({ message: 'Localisation créée avec succès', localisation });
  } catch (error) {
    console.error('Erreur création localisation:', error);
    res.status(500).json({ message: 'Erreur lors de la création de la localisation' });
  }
};

exports.update = async (req, res) => {
  try {
    const localisation = await Localisation.findByPk(req.params.id);
    if (!localisation) return res.status(404).json({ message: 'Localisation non trouvée' });

    await localisation.update(req.body);
    res.json({ message: 'Localisation modifiée avec succès', localisation });
  } catch (error) {
    console.error('Erreur modification localisation:', error);
    res.status(500).json({ message: 'Erreur lors de la modification de la localisation' });
  }
};

exports.delete = async (req, res) => {
  try {
    const localisation = await Localisation.findByPk(req.params.id);
    if (!localisation) return res.status(404).json({ message: 'Localisation non trouvée' });

    await localisation.destroy();
    res.json({ message: 'Localisation supprimée avec succès' });
  } catch (error) {
    console.error('Erreur suppression localisation:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression de la localisation' });
  }
};