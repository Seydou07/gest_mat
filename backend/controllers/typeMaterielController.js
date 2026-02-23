// controllers/typeMaterielController.js
const { TypeMateriel } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const types = await TypeMateriel.findAll({ order: [['nom', 'ASC']] });
    res.json(types);
  } catch (error) {
    console.error('Erreur récupération types:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des types' });
  }
};

exports.getById = async (req, res) => {
  try {
    const type = await TypeMateriel.findByPk(req.params.id);
    if (!type) return res.status(404).json({ message: 'Type non trouvé' });
    res.json(type);
  } catch (error) {
    console.error('Erreur récupération type:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du type' });
  }
};

exports.create = async (req, res) => {
  try {
    const { nom } = req.body;
    if (!nom) return res.status(400).json({ message: 'Le nom est requis' });

    const type = await TypeMateriel.create({ nom });
    res.status(201).json({ message: 'Type créé avec succès', type });
  } catch (error) {
    console.error('Erreur création type:', error);
    res.status(500).json({ message: 'Erreur lors de la création du type' });
  }
};

exports.update = async (req, res) => {
  try {
    const type = await TypeMateriel.findByPk(req.params.id);
    if (!type) return res.status(404).json({ message: 'Type non trouvé' });

    const { nom } = req.body;
    if (!nom) return res.status(400).json({ message: 'Le nom est requis' });

    await type.update({ nom });
    res.json({ message: 'Type modifié avec succès', type });
  } catch (error) {
    console.error('Erreur modification type:', error);
    res.status(500).json({ message: 'Erreur lors de la modification du type' });
  }
};

exports.delete = async (req, res) => {
  try {
    const type = await TypeMateriel.findByPk(req.params.id);
    if (!type) return res.status(404).json({ message: 'Type non trouvé' });

    await type.destroy();
    res.json({ message: 'Type supprimé avec succès' });
  } catch (error) {
    console.error('Erreur suppression type:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression du type' });
  }
};