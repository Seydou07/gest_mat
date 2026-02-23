// controllers/agentController.js
const { Agent, Fonction } = require('../models');

// Récupérer tous les agents
exports.getAllAgents = async (req, res) => {
  try {
    const agents = await Agent.findAll({
      include: [{ model: Fonction, attributes: ['id', 'nom'] }],
      order: [['createdAt', 'DESC']]
    });
    
    // Formater la réponse pour inclure directement le nom de la fonction
    const formattedAgents = agents.map(agent => ({
      id: agent.id,
      matricule: agent.matricule,
      nom: agent.nom,
      prenom: agent.prenom,
      date_naissance: agent.date_naissance,
      telephone: agent.telephone,
      email: agent.email,
      fonction_id: agent.fonction_id,
      fonction: agent.Fonction ? agent.Fonction.nom : null,
      createdAt: agent.createdAt,
      updatedAt: agent.updatedAt
    }));
    
    res.json(formattedAgents);
  } catch (error) {
    console.error('Erreur récupération agents:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des agents' });
  }
};

// Récupérer un agent par ID
exports.getAgentById = async (req, res) => {
  try {
    const agent = await Agent.findByPk(req.params.id, {
      include: [{ model: Fonction, attributes: ['id', 'nom'] }]
    });
    
    if (!agent) {
      return res.status(404).json({ message: 'Agent non trouvé' });
    }
    
    const formattedAgent = {
      id: agent.id,
      matricule: agent.matricule,
      nom: agent.nom,
      prenom: agent.prenom,
      date_naissance: agent.date_naissance,
      telephone: agent.telephone,
      email: agent.email,
      fonction_id: agent.fonction_id,
      fonction: agent.Fonction ? agent.Fonction.nom : null,
      createdAt: agent.createdAt,
      updatedAt: agent.updatedAt
    };
    
    res.json(formattedAgent);
  } catch (error) {
    console.error('Erreur récupération agent:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'agent' });
  }
};

// Créer un agent
exports.createAgent = async (req, res) => {
  try {
    const { matricule, nom, prenom, date_naissance, telephone, email, fonction } = req.body;
    
    // Validation des champs requis
    if (!matricule || !nom) {
      return res.status(400).json({ 
        message: 'Le matricule et le nom sont requis' 
      });
    }
    
    let fonctionId = null;
    
    // Gérer la fonction (auto-complétion + création automatique)
    if (fonction && typeof fonction === 'string' && fonction.trim() !== '') {
      const fonctionName = fonction.trim();
      
      try {
        // Chercher si la fonction existe déjà
        let existingFonction = await Fonction.findOne({ 
          where: { nom: fonctionName } 
        });
        
        if (existingFonction) {
          // La fonction existe déjà
          fonctionId = existingFonction.id;
        } else {
          // Créer une nouvelle fonction
          const newFonction = await Fonction.create({ 
            nom: fonctionName 
          });
          fonctionId = newFonction.id;
        }
      } catch (fonctionError) {
        console.error('Erreur gestion fonction:', fonctionError);
        // On continue même si la fonction échoue, fonctionId reste null
      }
    }
    
    // Créer l'agent
    const agent = await Agent.create({
      matricule: matricule.trim(),
      nom: nom.trim(),
      prenom: prenom ? prenom.trim() : null,
      date_naissance: date_naissance || null,
      telephone: telephone ? telephone.trim() : null,
      email: email ? email.trim() : null,
      fonction_id: fonctionId
    });
    
    // Récupérer l'agent avec sa fonction pour la réponse
    const agentWithFonction = await Agent.findByPk(agent.id, {
      include: [{ model: Fonction, attributes: ['id', 'nom'] }]
    });
    
    const formattedAgent = {
      id: agentWithFonction.id,
      matricule: agentWithFonction.matricule,
      nom: agentWithFonction.nom,
      prenom: agentWithFonction.prenom,
      date_naissance: agentWithFonction.date_naissance,
      telephone: agentWithFonction.telephone,
      email: agentWithFonction.email,
      fonction_id: agentWithFonction.fonction_id,
      fonction: agentWithFonction.Fonction ? agentWithFonction.Fonction.nom : null,
      createdAt: agentWithFonction.createdAt,
      updatedAt: agentWithFonction.updatedAt
    };

    res.status(201).json({
      message: 'Agent créé avec succès',
      agent: formattedAgent
    });
  } catch (error) {
    console.error('Erreur création agent:', error);
    console.error('Détails erreur:', error.message);
    console.error('Stack:', error.stack);
    
    // Message d'erreur plus détaillé pour le debug
    let errorMessage = 'Erreur lors de la création de l\'agent';
    if (error.name === 'SequelizeUniqueConstraintError') {
      errorMessage = 'Ce matricule existe déjà';
    } else if (error.name === 'SequelizeValidationError') {
      errorMessage = 'Données invalides: ' + error.errors.map(e => e.message).join(', ');
    }
    
    res.status(500).json({ 
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Modifier un agent
exports.updateAgent = async (req, res) => {
  try {
    const agent = await Agent.findByPk(req.params.id);
    if (!agent) {
      return res.status(404).json({ message: 'Agent non trouvé' });
    }
    
    const { matricule, nom, prenom, date_naissance, telephone, email, fonction } = req.body;
    
    let fonctionId = agent.fonction_id; // Garder l'ancienne valeur par défaut
    
    // Gérer la fonction (auto-complétion + création automatique)
    if (fonction && fonction.trim() !== '') {
      const fonctionName = fonction.trim();
      
      // Chercher si la fonction existe déjà
      let existingFonction = await Fonction.findOne({ 
        where: { nom: fonctionName } 
      });
      
      if (existingFonction) {
        // La fonction existe déjà
        fonctionId = existingFonction.id;
      } else {
        // Créer une nouvelle fonction
        const newFonction = await Fonction.create({ 
          nom: fonctionName 
        });
        fonctionId = newFonction.id;
      }
    } else if (fonction === '') {
      // Si la fonction est vidée, mettre à null
      fonctionId = null;
    }
    
    // Mettre à jour l'agent
    await agent.update({
      matricule,
      nom,
      prenom: prenom || null,
      date_naissance: date_naissance || null,
      telephone: telephone || null,
      email: email || null,
      fonction_id: fonctionId
    });
    
    // Récupérer l'agent avec sa fonction pour la réponse
    const updatedAgent = await Agent.findByPk(agent.id, {
      include: [{ model: Fonction, attributes: ['id', 'nom'] }]
    });
    
    const formattedAgent = {
      id: updatedAgent.id,
      matricule: updatedAgent.matricule,
      nom: updatedAgent.nom,
      prenom: updatedAgent.prenom,
      date_naissance: updatedAgent.date_naissance,
      telephone: updatedAgent.telephone,
      email: updatedAgent.email,
      fonction_id: updatedAgent.fonction_id,
      fonction: updatedAgent.Fonction ? updatedAgent.Fonction.nom : null,
      createdAt: updatedAgent.createdAt,
      updatedAt: updatedAgent.updatedAt
    };

    res.json({
      message: 'Agent modifié avec succès',
      agent: formattedAgent
    });
  } catch (error) {
    console.error('Erreur modification agent:', error);
    res.status(500).json({ message: 'Erreur lors de la modification de l\'agent' });
  }
};

// Supprimer un agent
exports.deleteAgent = async (req, res) => {
  try {
    const agent = await Agent.findByPk(req.params.id);
    if (!agent) {
      return res.status(404).json({ message: 'Agent non trouvé' });
    }

    await agent.destroy();

    res.json({ message: 'Agent supprimé avec succès' });
  } catch (error) {
    console.error('Erreur suppression agent:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'agent' });
  }
};