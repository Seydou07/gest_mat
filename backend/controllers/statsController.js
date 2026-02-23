// controllers/statsController.js
const { Agent, Projet, Materiel, Affectation } = require('../models');

exports.getStats = async (req, res) => {
    try {
        const [totalAgents, totalProjets, totalMateriels, totalAffectations] = await Promise.all([
            Agent.count(),
            Projet.count(),
            Materiel.count(),
            Affectation.count()
        ]);

        res.json({
            totalAgents,
            totalProjets,
            totalMateriels,
            totalAffectations
        });
    } catch (error) {
        console.error('Erreur récupération stats:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des statistiques' });
    }
};
