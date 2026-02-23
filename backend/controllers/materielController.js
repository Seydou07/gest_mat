const { Materiel, TypeMateriel, EtatMateriel, Localisation, Projet, Marque } = require('../models');

exports.getAllMateriels = async (req, res) => {
  try {
    const materiels = await Materiel.findAll({
      include: [
        { model: TypeMateriel, attributes: ['id', 'nom'] },
        { model: EtatMateriel, attributes: ['id', 'libelle'] },
        { model: Localisation, attributes: ['id', 'nom', 'ville'] },
        { model: Projet, attributes: ['id', 'nom'] },
        { model: Marque, attributes: ['id', 'nom'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(materiels);
  } catch (error) {
    console.error('Erreur récupération matériels:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des matériels' });
  }
};

exports.getMaterielById = async (req, res) => {
  try {
    const materiel = await Materiel.findByPk(req.params.id, {
      include: [
        { model: TypeMateriel, attributes: ['id', 'nom'] },
        { model: EtatMateriel, attributes: ['id', 'libelle'] },
        { model: Localisation, attributes: ['id', 'nom', 'ville'] },
        { model: Projet, attributes: ['id', 'nom'] },
        { model: Marque, attributes: ['id', 'nom'] }
      ]
    });
    if (!materiel) {
      return res.status(404).json({ message: 'Matériel non trouvé' });
    }
    res.json(materiel);
  } catch (error) {
    console.error('Erreur récupération matériel:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du matériel' });
  }
};

exports.createMateriel = async (req, res) => {
  try {
    const { libelle, numero_serie, type_id, etat_id, date_acquisition, valeur, localisation_id, id_projet, marque_id } = req.body;

    const materiel = await Materiel.create({
      libelle, numero_serie, type_id, etat_id, date_acquisition, valeur, localisation_id, id_projet, marque_id
    });

    res.status(201).json({
      message: 'Matériel créé avec succès',
      materiel
    });
  } catch (error) {
    console.error('Erreur création matériel:', error);
    res.status(500).json({ message: 'Erreur lors de la création du matériel' });
  }
};

exports.updateMateriel = async (req, res) => {
  try {
    const materiel = await Materiel.findByPk(req.params.id);
    if (!materiel) {
      return res.status(404).json({ message: 'Matériel non trouvé' });
    }

    await materiel.update(req.body);

    res.json({
      message: 'Matériel modifié avec succès',
      materiel
    });
  } catch (error) {
    console.error('Erreur modification matériel:', error);
    res.status(500).json({ message: 'Erreur lors de la modification du matériel' });
  }
};

exports.deleteMateriel = async (req, res) => {
  try {
    const materiel = await Materiel.findByPk(req.params.id);
    if (!materiel) {
      return res.status(404).json({ message: 'Matériel non trouvé' });
    }

    await materiel.destroy();

    res.json({ message: 'Matériel supprimé avec succès' });
  } catch (error) {
    console.error('Erreur suppression matériel:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression du matériel' });
  }
};