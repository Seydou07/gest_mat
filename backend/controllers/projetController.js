// controllers/projetController.js
const { Projet } = require('../models');

// Récupérer tous les projets
exports.getAllProjets = async (req, res) => {
  try {
    const projets = await Projet.findAll({
      order: [['createdAt', 'DESC']]
    });
    
    // Nettoyer les objets Sequelize pour ne retourner que dataValues
    const cleanedProjets = projets.map(projet => projet.get({ plain: true }));
    
    console.log('Projets retournés par le backend:', cleanedProjets); // Debug
    res.json(cleanedProjets);
  } catch (error) {
    console.error('Erreur récupération projets:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des projets' });
  }
};

// Récupérer un projet par ID
exports.getProjetById = async (req, res) => {
  try {
    const projet = await Projet.findByPk(req.params.id);
    if (!projet) {
      return res.status(404).json({ message: 'Projet non trouvé' });
    }
    
    // Nettoyer l'objet Sequelize pour ne retourner que dataValues
    const cleanedProjet = projet.get({ plain: true });
    res.json(cleanedProjet);
  } catch (error) {
    console.error('Erreur récupération projet:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du projet' });
  }
};

// Créer un projet
exports.createProjet = async (req, res) => {
  try {
    const { nom, description, date_debut, date_fin, statut, budget } = req.body;

    const projet = await Projet.create({
      nom,
      description,
      date_debut,
      date_fin,
      statut: statut || 'en_cours',
      budget
    });

    // Nettoyer l'objet Sequelize pour ne retourner que dataValues
    const cleanedProjet = projet.get({ plain: true });

    res.status(201).json({
      message: 'Projet créé avec succès',
      projet: cleanedProjet
    });
  } catch (error) {
    console.error('Erreur création projet:', error);
    res.status(500).json({ message: 'Erreur lors de la création du projet' });
  }
};

// Modifier un projet
exports.updateProjet = async (req, res) => {
  try {
    const projet = await Projet.findByPk(req.params.id);
    if (!projet) {
      return res.status(404).json({ message: 'Projet non trouvé' });
    }

    await projet.update(req.body);

    // Récupérer le projet mis à jour avec les dataValues nettoyés
    const updatedProjet = await Projet.findByPk(req.params.id);
    const cleanedProjet = updatedProjet.get({ plain: true });

    res.json({
      message: 'Projet modifié avec succès',
      projet: cleanedProjet
    });
  } catch (error) {
    console.error('Erreur modification projet:', error);
    res.status(500).json({ message: 'Erreur lors de la modification du projet' });
  }
};

// Supprimer un projet
exports.deleteProjet = async (req, res) => {
  try {
    const projet = await Projet.findByPk(req.params.id);
    if (!projet) {
      return res.status(404).json({ message: 'Projet non trouvé' });
    }

    await projet.destroy();

    res.json({ message: 'Projet supprimé avec succès' });
  } catch (error) {
    console.error('Erreur suppression projet:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression du projet' });
  }
};