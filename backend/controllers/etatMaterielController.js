// controllers/etatMaterielController.js
const { EtatMateriel } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const etats = await EtatMateriel.findAll({ order: [['libelle', 'ASC']] });
    res.json(etats);
  } catch (error) {
    console.error('Erreur récupération états:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des états' });
  }
};

exports.getById = async (req, res) => {
  try {
    const etat = await EtatMateriel.findByPk(req.params.id);
    if (!etat) return res.status(404).json({ message: 'État non trouvé' });
    res.json(etat);
  } catch (error) {
    console.error('Erreur récupération état:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'état' });
  }
};

exports.create = async (req, res) => {
  try {
    const { libelle, description } = req.body;
    if (!libelle) return res.status(400).json({ message: 'Le libellé est requis' });

    const etat = await EtatMateriel.create({ libelle, description });
    res.status(201).json({ message: 'État créé avec succès', etat });
  } catch (error) {
    console.error('Erreur création état:', error);
    res.status(500).json({ message: 'Erreur lors de la création de l\'état' });
  }
};

exports.update = async (req, res) => {
  try {
    const etat = await EtatMateriel.findByPk(req.params.id);
    if (!etat) return res.status(404).json({ message: 'État non trouvé' });

    await etat.update(req.body);
    res.json({ message: 'État modifié avec succès', etat });
  } catch (error) {
    console.error('Erreur modification état:', error);
    res.status(500).json({ message: 'Erreur lors de la modification de l\'état' });
  }
};

exports.delete = async (req, res) => {
  try {
    const etat = await EtatMateriel.findByPk(req.params.id);
    if (!etat) return res.status(404).json({ message: 'État non trouvé' });

    await etat.destroy();
    res.json({ message: 'État supprimé avec succès' });
  } catch (error) {
    console.error('Erreur suppression état:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'état' });
  }
};