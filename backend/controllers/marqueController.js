// controllers/marqueController.js
const { Marque } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const marques = await Marque.findAll({ order: [['nom', 'ASC']] });
    res.json(marques);
  } catch (error) {
    console.error('Erreur récupération marques:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des marques' });
  }
};

exports.getById = async (req, res) => {
  try {
    const marque = await Marque.findByPk(req.params.id);
    if (!marque) return res.status(404).json({ message: 'Marque non trouvée' });
    res.json(marque);
  } catch (error) {
    console.error('Erreur récupération marque:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération de la marque' });
  }
};

exports.create = async (req, res) => {
  try {
    const { nom } = req.body;
    if (!nom) return res.status(400).json({ message: 'Le nom est requis' });

    const marque = await Marque.create({ nom });
    res.status(201).json({ message: 'Marque créée avec succès', marque });
  } catch (error) {
    console.error('Erreur création marque:', error);
    res.status(500).json({ message: 'Erreur lors de la création de la marque' });
  }
};

exports.update = async (req, res) => {
  try {
    const marque = await Marque.findByPk(req.params.id);
    if (!marque) return res.status(404).json({ message: 'Marque non trouvée' });

    const { nom } = req.body;
    if (!nom) return res.status(400).json({ message: 'Le nom est requis' });

    await marque.update({ nom });
    res.json({ message: 'Marque modifiée avec succès', marque });
  } catch (error) {
    console.error('Erreur modification marque:', error);
    res.status(500).json({ message: 'Erreur lors de la modification de la marque' });
  }
};

exports.delete = async (req, res) => {
  try {
    const marque = await Marque.findByPk(req.params.id);
    if (!marque) return res.status(404).json({ message: 'Marque non trouvée' });

    await marque.destroy();
    res.json({ message: 'Marque supprimée avec succès' });
  } catch (error) {
    console.error('Erreur suppression marque:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression de la marque' });
  }
};