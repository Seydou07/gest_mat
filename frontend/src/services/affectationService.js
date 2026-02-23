// services/affectationService.js
import api from './api';

// Fonction utilitaire pour nettoyer les objets Sequelize
const cleanSequelizeData = (data) => {
  if (!data) return data;
  
  // Si c'est un tableau, nettoyer chaque élément
  if (Array.isArray(data)) {
    return data.map(item => {
      // Si l'élément a dataValues, l'extraire
      if (item && typeof item === 'object' && item.dataValues) {
        return item.dataValues;
      }
      return item;
    });
  }
  
  // Si c'est un objet unique avec dataValues, l'extraire
  if (typeof data === 'object' && data.dataValues) {
    return data.dataValues;
  }
  
  return data;
};

const affectationService = {
  // Récupérer toutes les affectations
  getAll: async () => {
    const response = await api.get('/affectations');
    return cleanSequelizeData(response.data);
  },

  // Récupérer une affectation par ID
  getById: async (id) => {
    const response = await api.get(`/affectations/${id}`);
    return cleanSequelizeData(response.data);
  },

  // Créer une affectation
  create: async (affectationData) => {
    const response = await api.post('/affectations', affectationData);
    // Le backend retourne { affectation: ... } donc on extrait affectation
    return cleanSequelizeData(response.data.affectation || response.data);
  },

  // Modifier une affectation
  update: async (id, affectationData) => {
    const response = await api.put(`/affectations/${id}`, affectationData);
    // Le backend retourne { affectation: ... } donc on extrait affectation
    return cleanSequelizeData(response.data.affectation || response.data);
  },

  // Supprimer une affectation
  delete: async (id) => {
    const response = await api.delete(`/affectations/${id}`);
    return cleanSequelizeData(response.data);
  },

  // Récupérer les agents pour le select
  getAgents: async () => {
    const response = await api.get('/agents');
    return cleanSequelizeData(response.data);
  },

  // Récupérer les matériels pour le select
  getMateriels: async () => {
    const response = await api.get('/materiels');
    return cleanSequelizeData(response.data);
  },

  // Récupérer les projets pour le select
  getProjets: async () => {
    const response = await api.get('/projets');
    return cleanSequelizeData(response.data);
  }
};

export default affectationService;