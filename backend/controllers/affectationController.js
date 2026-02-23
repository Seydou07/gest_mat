const { Affectation, Materiel, Agent, Projet } = require('../models');

exports.getAllAffectations = async (req, res) => {
  try {
    const affectations = await Affectation.findAll({
      include: [
        { model: Materiel, attributes: ['id', 'libelle', 'numero_serie'] },
        { model: Agent, attributes: ['id', 'nom', 'prenom', 'matricule'] },
        { model: Projet, attributes: ['id', 'nom'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(affectations);
  } catch (error) {
    console.error('Erreur récupération affectations:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des affectations' });
  }
};

exports.getAffectationById = async (req, res) => {
  try {
    const affectation = await Affectation.findByPk(req.params.id, {
      include: [
        { model: Materiel, attributes: ['id', 'libelle', 'numero_serie'] },
        { model: Agent, attributes: ['id', 'nom', 'prenom', 'matricule'] },
        { model: Projet, attributes: ['id', 'nom'] }
      ]
    });
    if (!affectation) {
      return res.status(404).json({ message: 'Affectation non trouvée' });
    }
    res.json(affectation);
  } catch (error) {
    console.error('Erreur récupération affectation:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'affectation' });
  }
};

exports.createAffectation = async (req, res) => {
  try {
    const { materiel_id, agent_id, projet_id, date_affectation, date_retour, commentaire } = req.body;

    const affectation = await Affectation.create({
      materiel_id, agent_id, projet_id, date_affectation, date_retour, commentaire,
      statut: 'en_cours',
      created_by: req.user?.username || 'system'
    });

    // Récupérer l'affectation créée avec les includes
    const createdAffectation = await Affectation.findByPk(affectation.id, {
      include: [
        { model: Materiel, attributes: ['id', 'libelle', 'numero_serie'] },
        { model: Agent, attributes: ['id', 'nom', 'prenom', 'matricule'] },
        { model: Projet, attributes: ['id', 'nom'] }
      ]
    });

    res.status(201).json({
      message: 'Affectation créée avec succès',
      affectation: createdAffectation
    });
  } catch (error) {
    console.error('Erreur création affectation:', error);
    res.status(500).json({ message: 'Erreur lors de la création de l\'affectation' });
  }
};

exports.updateAffectation = async (req, res) => {
  try {
    const affectation = await Affectation.findByPk(req.params.id, {
      include: [
        { model: Materiel, attributes: ['id', 'libelle', 'numero_serie'] },
        { model: Agent, attributes: ['id', 'nom', 'prenom', 'matricule'] },
        { model: Projet, attributes: ['id', 'nom'] }
      ]
    });
    if (!affectation) {
      return res.status(404).json({ message: 'Affectation non trouvée' });
    }

    await affectation.update(req.body);

    const updatedAffectation = await Affectation.findByPk(req.params.id, {
      include: [
        { model: Materiel, attributes: ['id', 'libelle', 'numero_serie'] },
        { model: Agent, attributes: ['id', 'nom', 'prenom', 'matricule'] },
        { model: Projet, attributes: ['id', 'nom'] }
      ]
    });

    res.json({
      message: 'Affectation modifiée avec succès',
      affectation: updatedAffectation
    });
  } catch (error) {
    console.error('Erreur modification affectation:', error);
    res.status(500).json({ message: 'Erreur lors de la modification de l\'affectation' });
  }
};

exports.deleteAffectation = async (req, res) => {
  try {
    const affectation = await Affectation.findByPk(req.params.id);
    if (!affectation) {
      return res.status(404).json({ message: 'Affectation non trouvée' });
    }

    await affectation.destroy();

    res.json({ message: 'Affectation supprimée avec succès' });
  } catch (error) {
    console.error('Erreur suppression affectation:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'affectation' });
  }
};